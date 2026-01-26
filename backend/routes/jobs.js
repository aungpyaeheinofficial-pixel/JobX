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
        CASE WHEN a.id IS NOT NULL THEN true ELSE false END as has_applied
      FROM jobs j
      INNER JOIN companies c ON j.company_id = c.id
      LEFT JOIN users u ON j.posted_by = u.id
      LEFT JOIN applications a ON j.id = a.job_id AND a.applicant_id = $1
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

    // Increment view count
    await query('UPDATE jobs SET views_count = views_count + 1 WHERE id = $1', [id]);

    res.json({ job: result.rows[0] });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
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
