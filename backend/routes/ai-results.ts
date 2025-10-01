import express from 'express';
import { query } from '../db';

const router = express.Router();

// Get AI model results
router.get('/', async (req: any, res: any) => {
  try {
    const clerkUserId = req.auth.userId;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const result = await query(
      'SELECT * FROM ai_model_results WHERE clerk_user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [clerkUserId, limit, offset]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching AI results:', error);
    res.status(500).json({ error: 'Failed to fetch AI results' });
  }
});

// Save AI model result
router.post('/', async (req: any, res: any) => {
  try {
    const clerkUserId = req.auth.userId;
    const { input_data, result_data } = req.body;
    
    const result = await query(
      'INSERT INTO ai_model_results (clerk_user_id, input_data, result_data) VALUES ($1, $2, $3) RETURNING *',
      [clerkUserId, JSON.stringify(input_data), JSON.stringify(result_data)]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error saving AI result:', error);
    res.status(500).json({ error: 'Failed to save AI result' });
  }
});

// Get specific AI result
router.get('/:id', async (req: any, res: any) => {
  try {
    const clerkUserId = req.auth.userId;
    const resultId = req.params.id;
    
    const result = await query(
      'SELECT * FROM ai_model_results WHERE id = $1 AND clerk_user_id = $2',
      [resultId, clerkUserId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'AI result not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching AI result:', error);
    res.status(500).json({ error: 'Failed to fetch AI result' });
  }
});

// Delete AI result
router.delete('/:id', async (req: any, res: any) => {
  try {
    const clerkUserId = req.auth.userId;
    const resultId = req.params.id;
    
    const result = await query(
      'DELETE FROM ai_model_results WHERE id = $1 AND clerk_user_id = $2 RETURNING *',
      [resultId, clerkUserId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'AI result not found' });
    }
    
    res.json({ message: 'AI result deleted successfully' });
  } catch (error) {
    console.error('Error deleting AI result:', error);
    res.status(500).json({ error: 'Failed to delete AI result' });
  }
});

export default router;
