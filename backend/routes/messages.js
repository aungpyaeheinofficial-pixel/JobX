import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get conversations (list of users you've messaged with)
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT DISTINCT ON (CASE WHEN m.sender_id = $1 THEN m.recipient_id ELSE m.sender_id END)
        CASE WHEN m.sender_id = $1 THEN m.recipient_id ELSE m.sender_id END as user_id,
        u.name as user_name,
        u.avatar_url as user_avatar,
        m.content as last_message,
        m.created_at as last_message_at,
        m.is_read,
        CASE WHEN m.sender_id = $1 THEN false ELSE true END as is_unread
      FROM messages m
      INNER JOIN users u ON (CASE WHEN m.sender_id = $1 THEN m.recipient_id ELSE m.sender_id END = u.id)
      WHERE m.sender_id = $1 OR m.recipient_id = $1
      ORDER BY (CASE WHEN m.sender_id = $1 THEN m.recipient_id ELSE m.sender_id END), m.created_at DESC`,
      [req.user.id]
    );
    res.json({ conversations: result.rows });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages with a specific user
router.get('/user/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await query(
      `SELECT 
        m.*,
        u.name as sender_name,
        u.avatar_url as sender_avatar
      FROM messages m
      INNER JOIN users u ON m.sender_id = u.id
      WHERE (m.sender_id = $1 AND m.recipient_id = $2)
         OR (m.sender_id = $2 AND m.recipient_id = $1)
      ORDER BY m.created_at DESC
      LIMIT $3 OFFSET $4`,
      [req.user.id, userId, parseInt(limit), offset]
    );

    // Mark messages as read
    await query(
      'UPDATE messages SET is_read = true WHERE recipient_id = $1 AND sender_id = $2 AND is_read = false',
      [req.user.id, userId]
    );

    res.json({ messages: result.rows.reverse() }); // Reverse to show oldest first
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/', authenticate, [
  body('recipient_id').isUUID().withMessage('Valid recipient ID is required'),
  body('content').trim().isLength({ min: 1 }).withMessage('Message content is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { recipient_id, content } = req.body;

    // Check if recipient exists
    const recipientCheck = await query(
      'SELECT id FROM users WHERE id = $1 AND is_active = true',
      [recipient_id]
    );

    if (recipientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    if (recipient_id === req.user.id) {
      return res.status(400).json({ error: 'Cannot send message to yourself' });
    }

    const result = await query(
      `INSERT INTO messages (sender_id, recipient_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.id, recipient_id, content]
    );

    res.status(201).json({ message: result.rows[0] });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Mark messages as read
router.patch('/read', authenticate, [
  body('sender_id').isUUID().withMessage('Valid sender ID is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sender_id } = req.body;

    await query(
      'UPDATE messages SET is_read = true WHERE recipient_id = $1 AND sender_id = $2 AND is_read = false',
      [req.user.id, sender_id]
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

// Get unread message count
router.get('/unread/count', authenticate, async (req, res) => {
  try {
    const result = await query(
      'SELECT COUNT(*) as count FROM messages WHERE recipient_id = $1 AND is_read = false',
      [req.user.id]
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

// Delete a message (soft delete - only for sender)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM messages WHERE id = $1 AND sender_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found or access denied' });
    }

    res.json({ message: 'Message deleted' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
