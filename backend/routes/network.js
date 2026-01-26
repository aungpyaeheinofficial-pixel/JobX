import express from 'express';
import { query } from '../config/database.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get connections
router.get('/connections', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT 
        c.*,
        u.name as connected_user_name,
        u.location as connected_user_location,
        u.avatar_url as connected_user_avatar
      FROM connections c
      INNER JOIN users u ON c.connected_user_id = u.id
      WHERE c.user_id = $1 AND c.status = 'accepted'
      ORDER BY c.created_at DESC`,
      [req.user.id]
    );

    res.json({ connections: result.rows });
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({ error: 'Failed to fetch connections' });
  }
});

// Send connection request
router.post('/connect/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot connect to yourself' });
    }

    // Check if connection already exists
    const existing = await query(
      'SELECT id, status FROM connections WHERE user_id = $1 AND connected_user_id = $2',
      [req.user.id, userId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Connection request already exists' });
    }

    await query(
      'INSERT INTO connections (user_id, connected_user_id, status) VALUES ($1, $2, $3)',
      [req.user.id, userId, 'pending']
    );

    res.json({ message: 'Connection request sent' });
  } catch (error) {
    console.error('Send connection error:', error);
    res.status(500).json({ error: 'Failed to send connection request' });
  }
});

export default router;
