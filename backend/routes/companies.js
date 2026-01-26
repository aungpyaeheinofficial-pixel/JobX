import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticate, requireEmployer } from '../middleware/auth.js';

const router = express.Router();

// Create/Update company profile
router.post('/', authenticate, [
  body('company_name').trim().isLength({ min: 2 }).withMessage('Company name is required'),
  body('industry').trim().notEmpty().withMessage('Industry is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company_name,
      company_size,
      industry,
      location,
      website,
      logo_url,
      description,
      hiring_urgency,
      roles_count
    } = req.body;

    // Check if company already exists
    const existing = await query(
      'SELECT id FROM companies WHERE user_id = $1',
      [req.user.id]
    );

    if (existing.rows.length > 0) {
      // Update existing
      const result = await query(
        `UPDATE companies SET
          company_name = $1, company_size = $2, industry = $3, location = $4,
          website = $5, logo_url = $6, description = $7, hiring_urgency = $8,
          roles_count = $9, setup_complete = true, setup_date = NOW(), updated_at = NOW()
         WHERE user_id = $10
         RETURNING *`,
        [company_name, company_size, industry, location, website, logo_url, description, hiring_urgency, roles_count, req.user.id]
      );
      res.json({ company: result.rows[0] });
    } else {
      // Create new
      const result = await query(
        `INSERT INTO companies (
          user_id, company_name, company_size, industry, location, website,
          logo_url, description, hiring_urgency, roles_count, setup_complete, setup_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, NOW())
        RETURNING *`,
        [req.user.id, company_name, company_size, industry, location, website, logo_url, description, hiring_urgency, roles_count]
      );
      res.status(201).json({ company: result.rows[0] });
    }
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({ error: 'Failed to create/update company' });
  }
});

// Get company profile (for current user)
router.get('/me', authenticate, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM companies WHERE user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({ company: result.rows[0] });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

export default router;
