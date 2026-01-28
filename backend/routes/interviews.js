import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticate, requireEmployer } from '../middleware/auth.js';

const router = express.Router();

// List interviews for an application (employer or applicant)
router.get('/application/:applicationId', authenticate, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const app = await query(
      `SELECT a.id, a.applicant_id, j.company_id
       FROM applications a JOIN jobs j ON a.job_id = j.id WHERE a.id = $1`,
      [applicationId]
    );
    if (app.rows.length === 0) return res.status(404).json({ error: 'Application not found' });
    const { applicant_id, company_id } = app.rows[0];
    const isApplicant = applicant_id === req.user.id;
    const companyCheck = await query(
      'SELECT id FROM companies WHERE id = $1 AND user_id = $2',
      [company_id, req.user.id]
    );
    const isEmployer = companyCheck.rows.length > 0;
    if (!isEmployer && !isApplicant) return res.status(403).json({ error: 'Not allowed' });
    const result = await query(
      'SELECT * FROM interviews WHERE application_id = $1 ORDER BY scheduled_at',
      [applicationId]
    );
    res.json({ interviews: result.rows });
  } catch (error) {
    console.error('Get interviews error:', error);
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
});

// Create interview (employer)
router.post('/', authenticate, requireEmployer, [
  body('application_id').isUUID(),
  body('scheduled_at').isISO8601(),
  body('interview_type').optional().isIn(['phone', 'video', 'in-person']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { application_id, scheduled_at, interview_type, duration_minutes, location, meeting_link, notes } = req.body;
    const app = await query(
      'SELECT a.id FROM applications a JOIN jobs j ON a.job_id = j.id WHERE a.id = $1 AND j.company_id = $2',
      [application_id, req.companyId]
    );
    if (app.rows.length === 0) return res.status(404).json({ error: 'Application not found' });
    const result = await query(
      `INSERT INTO interviews (application_id, scheduled_by, scheduled_at, interview_type, duration_minutes, location, meeting_link, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [application_id, req.user.id, scheduled_at, interview_type || 'video', duration_minutes || 60, location || null, meeting_link || null, notes || null]
    );
    res.status(201).json({ interview: result.rows[0] });
  } catch (error) {
    console.error('Create interview error:', error);
    res.status(500).json({ error: 'Failed to create interview' });
  }
});

router.patch('/:id', authenticate, requireEmployer, async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduled_at, interview_type, duration_minutes, location, meeting_link, notes, status } = req.body;
    const existing = await query(
      `SELECT i.id FROM interviews i
       JOIN applications a ON i.application_id = a.id
       JOIN jobs j ON a.job_id = j.id
       WHERE i.id = $1 AND j.company_id = $2`,
      [id, req.companyId]
    );
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Interview not found' });
    const updates = [];
    const values = [];
    let n = 1;
    if (scheduled_at !== undefined) { updates.push(`scheduled_at = $${n++}`); values.push(scheduled_at); }
    if (interview_type !== undefined) { updates.push(`interview_type = $${n++}`); values.push(interview_type); }
    if (duration_minutes !== undefined) { updates.push(`duration_minutes = $${n++}`); values.push(duration_minutes); }
    if (location !== undefined) { updates.push(`location = $${n++}`); values.push(location); }
    if (meeting_link !== undefined) { updates.push(`meeting_link = $${n++}`); values.push(meeting_link); }
    if (notes !== undefined) { updates.push(`notes = $${n++}`); values.push(notes); }
    if (status !== undefined) { updates.push(`status = $${n++}`); values.push(status); }
    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(id);
    const result = await query(
      `UPDATE interviews SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${n} RETURNING *`,
      values
    );
    res.json({ interview: result.rows[0] });
  } catch (error) {
    console.error('Update interview error:', error);
    res.status(500).json({ error: 'Failed to update interview' });
  }
});

export default router;
