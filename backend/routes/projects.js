import express from 'express';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user projects
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM projects WHERE creator_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json({ projects: result.rows });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create project
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, due_date, team_size } = req.body;

    const result = await query(
      `INSERT INTO projects (creator_id, title, description, due_date, team_size)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, title, description, due_date || null, team_size || 1]
    );

    res.status(201).json({ project: result.rows[0] });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

export default router;
