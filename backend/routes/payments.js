import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get wallet balance
router.get('/wallet', authenticate, async (req, res) => {
  try {
    // Calculate balances from transactions
    const balanceResult = await query(
      `SELECT 
        COALESCE(SUM(CASE WHEN type = 'incoming' AND status = 'completed' THEN amount ELSE 0 END), 0) as balance,
        COALESCE(SUM(CASE WHEN type = 'outgoing' AND status = 'pending' THEN amount ELSE 0 END), 0) as pending,
        COALESCE(SUM(CASE WHEN status = 'escrow' THEN amount ELSE 0 END), 0) as escrow
      FROM transactions WHERE user_id = $1`,
      [req.user.id]
    );

    res.json({
      balance: parseFloat(balanceResult.rows[0].balance) - parseFloat(balanceResult.rows[0].pending),
      pending: parseFloat(balanceResult.rows[0].pending),
      escrow: parseFloat(balanceResult.rows[0].escrow),
      currency: 'MMK'
    });
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ error: 'Failed to fetch wallet balance' });
  }
});

// Get transactions
router.get('/transactions', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20, category, type } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let sql = `
      SELECT * FROM transactions WHERE user_id = $1
    `;
    const params = [req.user.id];
    let paramCount = 2;

    if (category) {
      sql += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (type) {
      sql += ` AND type = $${paramCount}`;
      params.push(type);
      paramCount++;
    }

    sql += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), offset);

    const result = await query(sql, params);

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM transactions WHERE user_id = $1`,
      [req.user.id]
    );
    const total = parseInt(countResult.rows[0].count);

    res.json({
      transactions: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

export default router;
