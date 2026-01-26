import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT 
        id, name, location, role, industries, skills, goal,
        subscription_plan, subscription_status, avatar_url, created_at
      FROM users WHERE id = $1 AND is_active = true`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const updates = req.body;
    const allowedFields = ['name', 'location', 'industries', 'skills', 'goal', 'avatar_url'];
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        if (field === 'industries' || field === 'skills') {
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

    values.push(req.user.id);
    const result = await query(
      `UPDATE users SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING id, name, location, role, industries, skills, goal, avatar_url`,
      values
    );

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
