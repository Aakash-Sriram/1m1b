import express from 'express';
import { query } from '../db';

const router = express.Router();

// Get AI suggestions
router.get('/', async (req: any, res: any) => {
  try {
    const clerkUserId = req.auth.userId;
    const status = req.query.status || null;
    
    let queryText = 'SELECT * FROM ai_suggestions WHERE clerk_user_id = $1';
    let params = [clerkUserId];
    
    if (status) {
      queryText += ' AND status = $2';
      params.push(status);
    }
    
    queryText += ' ORDER BY created_at DESC';
    
    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

// Create AI suggestion
router.post('/', async (req: any, res: any) => {
  try {
    const clerkUserId = req.auth.userId;
    const { suggestion, status = 'pending' } = req.body;
    
    const result = await query(
      'INSERT INTO ai_suggestions (clerk_user_id, suggestion, status) VALUES ($1, $2, $3) RETURNING *',
      [clerkUserId, suggestion, status]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating suggestion:', error);
    res.status(500).json({ error: 'Failed to create suggestion' });
  }
});

// Update suggestion status
router.put('/:id', async (req: any, res: any) => {
  try {
    const clerkUserId = req.auth.userId;
    const suggestionId = req.params.id;
    const { status } = req.body;
    
    const result = await query(
      'UPDATE ai_suggestions SET status = $1 WHERE id = $2 AND clerk_user_id = $3 RETURNING *',
      [status, suggestionId, clerkUserId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating suggestion:', error);
    res.status(500).json({ error: 'Failed to update suggestion' });
  }
});

// Delete suggestion
router.delete('/:id', async (req: any, res: any) => {
  try {
    const clerkUserId = req.auth.userId;
    const suggestionId = req.params.id;
    
    const result = await query(
      'DELETE FROM ai_suggestions WHERE id = $1 AND clerk_user_id = $2 RETURNING *',
      [suggestionId, clerkUserId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }
    
    res.json({ message: 'Suggestion deleted successfully' });
  } catch (error) {
    console.error('Error deleting suggestion:', error);
    res.status(500).json({ error: 'Failed to delete suggestion' });
  }
});

export default router;
