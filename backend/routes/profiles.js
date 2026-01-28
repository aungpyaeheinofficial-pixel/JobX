import express from 'express';
import { query } from '../config/database.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get extended profile (user_profiles + users) for a user
router.get('/:userId', optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const userResult = await query(
      `SELECT id, name, email, location, role, industries, skills, goal, avatar_url, 
       subscription_plan, subscription_status, created_at
       FROM users WHERE id = $1 AND is_active = true`,
      [userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const profileResult = await query(
      'SELECT * FROM user_profiles WHERE user_id = $1',
      [userId]
    );
    const user = userResult.rows[0];
    const extended = profileResult.rows[0] || null;
    res.json({ user, profile: extended });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get current user's own extended profile
router.get('/me/extended', authenticate, async (req, res) => {
  try {
    const [userResult, profileResult] = await Promise.all([
      query(
        `SELECT id, name, email, location, role, industries, skills, goal, avatar_url,
         subscription_plan, subscription_status, created_at FROM users WHERE id = $1`,
        [req.user.id]
      ),
      query('SELECT * FROM user_profiles WHERE user_id = $1', [req.user.id]),
    ]);
    const user = userResult.rows[0];
    const profile = profileResult.rows[0] || null;
    res.json({ user, profile });
  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Create or update extended profile (edit profile)
router.put('/me', authenticate, async (req, res) => {
  try {
    const {
      bio,
      title,
      website,
      phone,
      experience_years,
      education,
      work_experience,
      portfolio_items,
      certifications,
      resume_url,
      profile_completion,
    } = req.body;

    const upsert = `
      INSERT INTO user_profiles (
        user_id, bio, title, website, phone, experience_years,
        education, work_experience, portfolio_items, certifications,
        resume_url, profile_completion
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (user_id) DO UPDATE SET
        bio = COALESCE(EXCLUDED.bio, user_profiles.bio),
        title = COALESCE(EXCLUDED.title, user_profiles.title),
        website = COALESCE(EXCLUDED.website, user_profiles.website),
        phone = COALESCE(EXCLUDED.phone, user_profiles.phone),
        experience_years = COALESCE(EXCLUDED.experience_years, user_profiles.experience_years),
        education = COALESCE(EXCLUDED.education::jsonb, user_profiles.education),
        work_experience = COALESCE(EXCLUDED.work_experience::jsonb, user_profiles.work_experience),
        portfolio_items = COALESCE(EXCLUDED.portfolio_items::jsonb, user_profiles.portfolio_items),
        certifications = COALESCE(EXCLUDED.certifications::jsonb, user_profiles.certifications),
        resume_url = COALESCE(EXCLUDED.resume_url, user_profiles.resume_url),
        profile_completion = COALESCE(EXCLUDED.profile_completion, user_profiles.profile_completion),
        updated_at = NOW()
    `;
    const edu = education != null ? JSON.stringify(education) : '[]';
    const work = work_experience != null ? JSON.stringify(work_experience) : '[]';
    const port = portfolio_items != null ? JSON.stringify(portfolio_items) : '[]';
    const cert = certifications != null ? JSON.stringify(certifications) : '[]';
    await query(upsert, [
      req.user.id,
      bio ?? null,
      title ?? null,
      website ?? null,
      phone ?? null,
      experience_years ?? null,
      edu,
      work,
      port,
      cert,
      resume_url ?? null,
      profile_completion ?? null,
    ]);
    const r = await query('SELECT * FROM user_profiles WHERE user_id = $1', [req.user.id]);
    res.json({ profile: r.rows[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
