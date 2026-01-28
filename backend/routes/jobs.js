import express from 'express';
import { body, validationResult, query as queryValidator } from 'express-validator';
import { query } from '../config/database.js';
import { authenticate, optionalAuth, requireEmployer } from '../middleware/auth.js';

const router = express.Router();

// Get all jobs (public, with optional auth for personalized results)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      location, 
      job_type, 
      work_mode,
      tier,
      search 
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    let sql = `
      SELECT 
        j.*,
        c.company_name,
        c.logo_url as company_logo,
        c.industry as company_industry,
        u.name as posted_by_name,
        CASE WHEN a.id IS NOT NULL THEN true ELSE false END as has_applied,
        CASE WHEN s.id IS NOT NULL THEN true ELSE false END as is_saved
      FROM jobs j
      INNER JOIN companies c ON j.company_id = c.id
      LEFT JOIN users u ON j.posted_by = u.id
      LEFT JOIN applications a ON j.id = a.job_id AND a.applicant_id = $1
      LEFT JOIN saved_jobs s ON j.id = s.job_id AND s.user_id = $1
      WHERE j.status = 'active'
    `;
    
    const params = [req.user?.id || null];
    let paramCount = 2;

    if (location) {
      sql += ` AND j.location ILIKE $${paramCount}`;
      params.push(`%${location}%`);
      paramCount++;
    }

    if (job_type) {
      sql += ` AND j.job_type = $${paramCount}`;
      params.push(job_type);
      paramCount++;
    }

    if (work_mode) {
      sql += ` AND j.work_mode = $${paramCount}`;
      params.push(work_mode);
      paramCount++;
    }

    if (tier) {
      sql += ` AND j.tier = $${paramCount}`;
      params.push(tier);
      paramCount++;
    }

    if (search) {
      sql += ` AND (j.title ILIKE $${paramCount} OR j.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    // Order by tier (featured first), then by date
    sql += ` ORDER BY 
      CASE j.tier 
        WHEN 'featured' THEN 1 
        WHEN 'standard' THEN 2 
        ELSE 3 
      END,
      j.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    
    params.push(parseInt(limit), offset);

    const result = await query(sql, params);

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM jobs WHERE status = 'active'`
    );
    const total = parseInt(countResult.rows[0].count);

    res.json({
      jobs: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Get my saved jobs (must be before /:id)
router.get('/saved', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const result = await query(
      `SELECT j.*, c.company_name, c.logo_url as company_logo, c.industry as company_industry,
        s.saved_at,
        CASE WHEN a.id IS NOT NULL THEN true ELSE false END as has_applied
       FROM saved_jobs s
       INNER JOIN jobs j ON s.job_id = j.id
       INNER JOIN companies c ON j.company_id = c.id
       LEFT JOIN applications a ON j.id = a.job_id AND a.applicant_id = $1
       WHERE s.user_id = $2 AND j.status = 'active'
       ORDER BY s.saved_at DESC LIMIT $3 OFFSET $4`,
      [req.user.id, req.user.id, parseInt(limit), offset]
    );
    const count = await query('SELECT COUNT(*) FROM saved_jobs WHERE user_id = $1', [req.user.id]);
    res.json({
      jobs: result.rows,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: parseInt(count.rows[0].count) },
    });
  } catch (error) {
    console.error('Get saved jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch saved jobs' });
  }
});

// Get my job alerts (must be before /:id)
router.get('/alerts', authenticate, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM job_alerts WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ alerts: result.rows });
  } catch (error) {
    console.error('Get job alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch job alerts' });
  }
});

router.post('/alerts', authenticate, async (req, res) => {
  try {
    const { keywords, location, job_types, frequency = 'daily' } = req.body;
    const result = await query(
      `INSERT INTO job_alerts (user_id, keywords, location, job_types, frequency)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, JSON.stringify(keywords || []), location || null, JSON.stringify(job_types || []), frequency]
    );
    res.status(201).json({ alert: result.rows[0] });
  } catch (error) {
    console.error('Create job alert error:', error);
    res.status(500).json({ error: 'Failed to create job alert' });
  }
});

router.put('/alerts/:alertId', authenticate, async (req, res) => {
  try {
    const { alertId } = req.params;
    const { keywords, location, job_types, frequency, is_active } = req.body;
    const updates = [];
    const values = [];
    let n = 1;
    if (keywords !== undefined) { updates.push(`keywords = $${n++}`); values.push(JSON.stringify(keywords)); }
    if (location !== undefined) { updates.push(`location = $${n++}`); values.push(location); }
    if (job_types !== undefined) { updates.push(`job_types = $${n++}`); values.push(JSON.stringify(job_types)); }
    if (frequency !== undefined) { updates.push(`frequency = $${n++}`); values.push(frequency); }
    if (is_active !== undefined) { updates.push(`is_active = $${n++}`); values.push(is_active); }
    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(alertId, req.user.id);
    const result = await query(
      `UPDATE job_alerts SET ${updates.join(', ')}, updated_at = NOW()
       WHERE id = $${n} AND user_id = $${n + 1} RETURNING *`,
      values
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Alert not found' });
    res.json({ alert: result.rows[0] });
  } catch (error) {
    console.error('Update job alert error:', error);
    res.status(500).json({ error: 'Failed to update job alert' });
  }
});

router.delete('/alerts/:alertId', authenticate, async (req, res) => {
  try {
    const { alertId } = req.params;
    const result = await query(
      'DELETE FROM job_alerts WHERE id = $1 AND user_id = $2 RETURNING id',
      [alertId, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Alert not found' });
    res.json({ message: 'Alert deleted' });
  } catch (error) {
    console.error('Delete job alert error:', error);
    res.status(500).json({ error: 'Failed to delete job alert' });
  }
});

// Get single job
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT 
        j.*,
        c.company_name,
        c.logo_url as company_logo,
        c.industry as company_industry,
        c.description as company_description,
        c.website as company_website,
        u.name as posted_by_name,
        CASE WHEN a.id IS NOT NULL THEN true ELSE false END as has_applied
      FROM jobs j
      INNER JOIN companies c ON j.company_id = c.id
      LEFT JOIN users u ON j.posted_by = u.id
      LEFT JOIN applications a ON j.id = a.job_id AND a.applicant_id = $1
      WHERE j.id = $2`,
      [req.user?.id || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Record job view when user is logged in (unique per user; bump count only on first view)
    if (req.user) {
      const insert = await query(
        `INSERT INTO job_views (job_id, user_id) VALUES ($1, $2)
         ON CONFLICT (job_id, user_id) DO NOTHING RETURNING id`,
        [id, req.user.id]
      );
      if (insert.rows.length > 0) {
        await query('UPDATE jobs SET views_count = views_count + 1 WHERE id = $1', [id]);
      }
    } else {
      await query('UPDATE jobs SET views_count = views_count + 1 WHERE id = $1', [id]);
    }

    const job = result.rows[0];
    if (req.user) {
      const saved = await query(
        'SELECT id FROM saved_jobs WHERE job_id = $1 AND user_id = $2',
        [id, req.user.id]
      );
      job.is_saved = saved.rows.length > 0;
    } else {
      job.is_saved = false;
    }
    res.json({ job });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// Save job (add to saved_jobs)
router.post('/:id/save', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const job = await query('SELECT id FROM jobs WHERE id = $1 AND status = $2', [id, 'active']);
    if (job.rows.length === 0) return res.status(404).json({ error: 'Job not found' });
    await query(
      'INSERT INTO saved_jobs (job_id, user_id) VALUES ($1, $2) ON CONFLICT (job_id, user_id) DO NOTHING',
      [id, req.user.id]
    );
    res.json({ saved: true });
  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({ error: 'Failed to save job' });
  }
});

// Unsave job
router.delete('/:id/save', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM saved_jobs WHERE job_id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );
    res.json({ saved: false, removed: result.rows.length > 0 });
  } catch (error) {
    console.error('Unsave job error:', error);
    res.status(500).json({ error: 'Failed to unsave job' });
  }
});

// Create job (employer only)
router.post('/', authenticate, requireEmployer, [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').trim().isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('job_type').isIn(['Full-time', 'Part-time', 'Freelance', 'Internship']),
  body('work_mode').isIn(['On-site', 'Remote', 'Hybrid']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      requirements,
      location,
      job_type,
      work_mode,
      salary,
      skills,
      tier = 'free'
    } = req.body;

    // Calculate expiration date based on tier
    let expiresAt = null;
    if (tier === 'standard') {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
    } else if (tier === 'featured') {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 45);
    } else {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
    }

    const result = await query(
      `INSERT INTO jobs (
        company_id, posted_by, title, description, requirements, location,
        job_type, work_mode, salary, skills, tier, expires_at, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'active')
      RETURNING *`,
      [
        req.companyId,
        req.user.id,
        title,
        description,
        requirements || null,
        location,
        job_type,
        work_mode,
        salary || null,
        JSON.stringify(skills || []),
        tier,
        expiresAt
      ]
    );

    // If paid tier, create transaction record
    if (tier !== 'free') {
      const tierPrices = { standard: 15, featured: 39 };
      await query(
        `INSERT INTO transactions (
          user_id, type, amount, currency, description, category, status, related_id, related_type
        ) VALUES ($1, 'outgoing', $2, 'USD', $3, 'job_posting', 'completed', $4, 'job')`,
        [
          req.user.id,
          tierPrices[tier],
          `${tier} job posting: ${title}`,
          result.rows[0].id,
        ]
      );
    }

    res.status(201).json({ job: result.rows[0] });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// Update job (employer only, own jobs)
router.put('/:id', authenticate, requireEmployer, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Verify job belongs to company
    const jobCheck = await query(
      'SELECT id FROM jobs WHERE id = $1 AND company_id = $2',
      [id, req.companyId]
    );

    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found or access denied' });
    }

    // Build update query dynamically
    const allowedFields = ['title', 'description', 'requirements', 'location', 'job_type', 'work_mode', 'salary', 'skills', 'status'];
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        if (field === 'skills') {
          updateFields.push(`${field} = $${paramCount}`);
          values.push(JSON.stringify(updates[field]));
        } else {
          updateFields.push(`${field} = $${paramCount}`);
          values.push(updates[field]);
        }
        paramCount++;
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    values.push(id);
    const result = await query(
      `UPDATE jobs SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING *`,
      values
    );

    res.json({ job: result.rows[0] });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Delete job (employer only)
router.delete('/:id', authenticate, requireEmployer, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify job belongs to company
    const jobCheck = await query(
      'SELECT id FROM jobs WHERE id = $1 AND company_id = $2',
      [id, req.companyId]
    );

    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found or access denied' });
    }

    await query('UPDATE jobs SET status = $1 WHERE id = $2', ['closed', id]);

    res.json({ message: 'Job closed successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

export default router;
