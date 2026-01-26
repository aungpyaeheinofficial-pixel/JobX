import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticate, requireEmployer } from '../middleware/auth.js';

const router = express.Router();

// Apply to job
router.post('/', authenticate, [
  body('job_id').isUUID().withMessage('Valid job ID is required'),
  body('cover_letter').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { job_id, cover_letter, resume_url } = req.body;

    // Check if job exists and is active
    const jobCheck = await query(
      'SELECT id, status FROM jobs WHERE id = $1',
      [job_id]
    );

    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (jobCheck.rows[0].status !== 'active') {
      return res.status(400).json({ error: 'Job is no longer accepting applications' });
    }

    // Check if already applied
    const existingApp = await query(
      'SELECT id FROM applications WHERE job_id = $1 AND applicant_id = $2',
      [job_id, req.user.id]
    );

    if (existingApp.rows.length > 0) {
      return res.status(400).json({ error: 'You have already applied to this job' });
    }

    // Check subscription limits for free users
    if (req.user.subscription_plan === 'free') {
      const appCount = await query(
        `SELECT COUNT(*) FROM applications 
         WHERE applicant_id = $1 
         AND applied_at >= NOW() - INTERVAL '30 days'`,
        [req.user.id]
      );
      
      if (parseInt(appCount.rows[0].count) >= 5) {
        return res.status(403).json({ 
          error: 'Monthly application limit reached. Upgrade to Premium for unlimited applications.',
          requiresPremium: true
        });
      }
    }

    // Create application
    const result = await query(
      `INSERT INTO applications (job_id, applicant_id, cover_letter, resume_url, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING *`,
      [job_id, req.user.id, cover_letter || null, resume_url || null]
    );

    // Update job applications count
    await query(
      'UPDATE jobs SET applications_count = applications_count + 1 WHERE id = $1',
      [job_id]
    );

    res.status(201).json({ application: result.rows[0] });
  } catch (error) {
    console.error('Apply to job error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Get user's applications
router.get('/my-applications', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let sql = `
      SELECT 
        a.*,
        j.title as job_title,
        j.location as job_location,
        j.job_type,
        j.work_mode,
        c.company_name,
        c.logo_url as company_logo
      FROM applications a
      INNER JOIN jobs j ON a.job_id = j.id
      INNER JOIN companies c ON j.company_id = c.id
      WHERE a.applicant_id = $1
    `;

    const params = [req.user.id];
    let paramCount = 2;

    if (status) {
      sql += ` AND a.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    sql += ` ORDER BY a.applied_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), offset);

    const result = await query(sql, params);

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM applications WHERE applicant_id = $1${status ? ` AND status = '${status}'` : ''}`,
      [req.user.id]
    );
    const total = parseInt(countResult.rows[0].count);

    res.json({
      applications: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Withdraw application
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify application belongs to user
    const appCheck = await query(
      'SELECT id, job_id FROM applications WHERE id = $1 AND applicant_id = $2',
      [id, req.user.id]
    );

    if (appCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    await query('DELETE FROM applications WHERE id = $1', [id]);

    // Update job applications count
    await query(
      'UPDATE jobs SET applications_count = applications_count - 1 WHERE id = $1',
      [appCheck.rows[0].job_id]
    );

    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({ error: 'Failed to withdraw application' });
  }
});

// Get applications for a job (employer only)
router.get('/job/:jobId', authenticate, requireEmployer, async (req, res) => {
  try {
    const { jobId } = req.params;

    // Verify job belongs to company
    const jobCheck = await query(
      'SELECT id FROM jobs WHERE id = $1 AND company_id = $2',
      [jobId, req.companyId]
    );

    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found or access denied' });
    }

    const result = await query(
      `SELECT 
        a.*,
        u.name as applicant_name,
        u.email as applicant_email,
        u.location as applicant_location,
        u.skills as applicant_skills,
        u.industries as applicant_industries
      FROM applications a
      INNER JOIN users u ON a.applicant_id = u.id
      WHERE a.job_id = $1
      ORDER BY a.applied_at DESC`,
      [jobId]
    );

    res.json({ applications: result.rows });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Update application status (employer only)
router.patch('/:id/status', authenticate, requireEmployer, [
  body('status').isIn(['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Verify application belongs to company's job
    const appCheck = await query(
      `SELECT a.id FROM applications a
       INNER JOIN jobs j ON a.job_id = j.id
       WHERE a.id = $1 AND j.company_id = $2`,
      [id, req.companyId]
    );

    if (appCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found or access denied' });
    }

    const result = await query(
      `UPDATE applications 
       SET status = $1, reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    res.json({ application: result.rows[0] });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

export default router;
