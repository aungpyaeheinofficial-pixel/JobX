import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

// Verify JWT Token
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const result = await query(
      'SELECT id, email, name, role, subscription_plan, subscription_status FROM users WHERE id = $1 AND is_active = true',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Authentication error' });
  }
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const result = await query(
        'SELECT id, email, name, role, subscription_plan, subscription_status FROM users WHERE id = $1 AND is_active = true',
        [decoded.userId]
      );

      if (result.rows.length > 0) {
        req.user = result.rows[0];
      }
    }
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Check if user has premium subscription
export const requirePremium = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.subscription_plan === 'free' || req.user.subscription_status !== 'active') {
    return res.status(403).json({ 
      error: 'Premium subscription required',
      requiresPremium: true 
    });
  }

  next();
};

// Check if user is employer
export const requireEmployer = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Check if user has company
  const result = await query(
    'SELECT id FROM companies WHERE user_id = $1',
    [req.user.id]
  );

  if (result.rows.length === 0) {
    return res.status(403).json({ 
      error: 'Employer account required. Please complete company setup first.' 
    });
  }

  req.companyId = result.rows[0].id;
  next();
};
