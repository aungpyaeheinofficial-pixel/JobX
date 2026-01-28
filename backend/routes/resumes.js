import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM resumes WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
      [req.user.id]
    );
    res.json({ resumes: result.rows });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

router.post('/', authenticate, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('file_url').trim().notEmpty().withMessage('File URL is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { title, file_url, file_name, is_default } = req.body;
    if (is_default) {
      await query('UPDATE resumes SET is_default = false WHERE user_id = $1', [req.user.id]);
    }
    const result = await query(
      `INSERT INTO resumes (user_id, title, file_url, file_name, is_default)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, title, file_url, file_name || null, !!is_default]
    );
    res.status(201).json({ resume: result.rows[0] });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ error: 'Failed to create resume' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, file_url, file_name, is_default } = req.body;
    const check = await query('SELECT id FROM resumes WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Resume not found' });
    if (is_default) {
      await query('UPDATE resumes SET is_default = false WHERE user_id = $1', [req.user.id]);
    }
    const updates = [];
    const values = [];
    let n = 1;
    if (title !== undefined) { updates.push(`title = $${n++}`); values.push(title); }
    if (file_url !== undefined) { updates.push(`file_url = $${n++}`); values.push(file_url); }
    if (file_name !== undefined) { updates.push(`file_name = $${n++}`); values.push(file_name); }
    if (is_default !== undefined) { updates.push(`is_default = $${n++}`); values.push(!!is_default); }
    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(id);
    const result = await query(
      `UPDATE resumes SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${n} RETURNING *`,
      values
    );
    res.json({ resume: result.rows[0] });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ error: 'Failed to update resume' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM resumes WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Resume not found' });
    res.json({ message: 'Resume deleted' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

export default router;
