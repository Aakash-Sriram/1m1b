import express from 'express';
import { query } from '../../db.js';

const router = express.Router();

// Get user profile
router.get('/', async (req: any, res: any) => {
  try {
    const clerkUserId = req.auth.userId;
    
    const result = await query(
      'SELECT * FROM profiles WHERE clerk_user_id = $1',
      [clerkUserId]
    );
    
    if (result.rows.length === 0) {
      // Create default profile if doesn't exist
      await query(
        'INSERT INTO profiles (clerk_user_id, display_name, preferences) VALUES ($1, $2, $3)',
        [clerkUserId, 'New User', {}]
      );
      
      return res.json({
        clerk_user_id: clerkUserId,
        display_name: 'New User',
        preferences: {},
        updated_at: new Date()
      });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/', async (req: any, res: any) => {
  try {
    const clerkUserId = req.auth.userId;
    const { display_name, preferences } = req.body;
    
    const result = await query(
      'UPDATE profiles SET display_name = $1, preferences = $2, updated_at = CURRENT_TIMESTAMP WHERE clerk_user_id = $3 RETURNING *',
      [display_name, preferences, clerkUserId]
    );
    
    if (result.rows.length === 0) {
      // Insert if profile doesn't exist
      const insertResult = await query(
        'INSERT INTO profiles (clerk_user_id, display_name, preferences) VALUES ($1, $2, $3) RETURNING *',
        [clerkUserId, display_name, preferences]
      );
      return res.json(insertResult.rows[0]);
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
