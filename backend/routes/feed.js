import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get feed posts
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, community } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let sql = `
      SELECT 
        p.*,
        u.name as author_name,
        u.location as author_location,
        u.avatar_url as author_avatar,
        CASE WHEN l.id IS NOT NULL THEN true ELSE false END as is_liked,
        CASE WHEN b.id IS NOT NULL THEN true ELSE false END as is_bookmarked,
        CASE WHEN s.id IS NOT NULL THEN true ELSE false END as is_shared
      FROM feed_posts p
      INNER JOIN users u ON p.author_id = u.id
      LEFT JOIN post_likes l ON p.id = l.post_id AND l.user_id = $1
      LEFT JOIN post_bookmarks b ON p.id = b.post_id AND b.user_id = $1
      LEFT JOIN post_shares s ON p.id = s.post_id AND s.user_id = $1
      WHERE 1=1
    `;

    const params = [req.user?.id || null];
    let paramCount = 2;

    if (type) {
      sql += ` AND p.post_type = $${paramCount}`;
      params.push(type);
      paramCount++;
    }

    sql += ` ORDER BY p.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), offset);

    const result = await query(sql, params);

    res.json({ posts: result.rows });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

// Create post
router.post('/', authenticate, [
  body('content').trim().isLength({ min: 1 }).withMessage('Content cannot be empty'),
  body('post_type').optional().isIn(['progress', 'thought', 'announcement', 'opportunity', 'story']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, image_url, post_type = 'progress' } = req.body;

    const result = await query(
      `INSERT INTO feed_posts (author_id, content, image_url, post_type)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, content, image_url || null, post_type]
    );

    res.status(201).json({ post: result.rows[0] });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Like/Unlike post
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if already liked
    const existing = await query(
      'SELECT id FROM post_likes WHERE post_id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (existing.rows.length > 0) {
      // Unlike
      await query('DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2', [id, req.user.id]);
      await query('UPDATE feed_posts SET likes_count = likes_count - 1 WHERE id = $1', [id]);
      res.json({ liked: false });
    } else {
      // Like
      await query('INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)', [id, req.user.id]);
      await query('UPDATE feed_posts SET likes_count = likes_count + 1 WHERE id = $1', [id]);
      res.json({ liked: true });
    }
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Unlike post (DELETE method)
router.delete('/:id/like', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2', [id, req.user.id]);
    await query('UPDATE feed_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = $1', [id]);
    res.json({ liked: false });
  } catch (error) {
    console.error('Unlike post error:', error);
    res.status(500).json({ error: 'Failed to unlike post' });
  }
});

// Bookmark/Unbookmark post
router.post('/:id/bookmark', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await query(
      'SELECT id FROM post_bookmarks WHERE post_id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (existing.rows.length > 0) {
      await query('DELETE FROM post_bookmarks WHERE post_id = $1 AND user_id = $2', [id, req.user.id]);
      res.json({ bookmarked: false });
    } else {
      await query('INSERT INTO post_bookmarks (post_id, user_id) VALUES ($1, $2)', [id, req.user.id]);
      res.json({ bookmarked: true });
    }
  } catch (error) {
    console.error('Bookmark post error:', error);
    res.status(500).json({ error: 'Failed to bookmark post' });
  }
});

// Unbookmark post (DELETE method)
router.delete('/:id/bookmark', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM post_bookmarks WHERE post_id = $1 AND user_id = $2', [id, req.user.id]);
    res.json({ bookmarked: false });
  } catch (error) {
    console.error('Unbookmark post error:', error);
    res.status(500).json({ error: 'Failed to unbookmark post' });
  }
});

// Add comment
router.post('/:id/comments', authenticate, [
  body('content').trim().isLength({ min: 1 }).withMessage('Comment cannot be empty'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { content } = req.body;

    const result = await query(
      `INSERT INTO post_comments (post_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, req.user.id, content]
    );

    await query('UPDATE feed_posts SET comments_count = comments_count + 1 WHERE id = $1', [id]);

    res.status(201).json({ comment: result.rows[0] });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Get comments for a post
router.get('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT 
        c.*,
        u.name as author_name,
        u.avatar_url as author_avatar
      FROM post_comments c
      INNER JOIN users u ON c.user_id = u.id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC`,
      [id]
    );

    res.json({ comments: result.rows });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Share post (records in post_shares, increments shares_count)
router.post('/:id/share', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query(
      'SELECT id FROM post_shares WHERE post_id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (existing.rows.length > 0) {
      return res.json({ shared: true, already: true });
    }
    await query(
      'INSERT INTO post_shares (post_id, user_id) VALUES ($1, $2) ON CONFLICT (post_id, user_id) DO NOTHING',
      [id, req.user.id]
    );
    await query('UPDATE feed_posts SET shares_count = COALESCE(shares_count, 0) + 1 WHERE id = $1', [id]);
    res.json({ shared: true });
  } catch (error) {
    console.error('Share post error:', error);
    res.status(500).json({ error: 'Failed to share post' });
  }
});

// Record post view (idempotent per user)
router.post('/:id/view', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user) return res.json({ viewed: false });
    await query(
      `INSERT INTO post_views (post_id, user_id) VALUES ($1, $2)
       ON CONFLICT (post_id, user_id) DO NOTHING`,
      [id, req.user.id]
    );
    res.json({ viewed: true });
  } catch (error) {
    console.error('Post view error:', error);
    res.status(500).json({ error: 'Failed to record view' });
  }
});

export default router;
