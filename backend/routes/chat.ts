import express from 'express';
import { query } from '../db';

const router = express.Router();

// Get chat history
router.get('/', async (req: any, res: any) => {
  try {
    const clerkUserId = req.auth.userId;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const result = await query(
      'SELECT * FROM chatbot_logs WHERE clerk_user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [clerkUserId, limit, offset]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Save chat message
router.post('/', async (req: any, res: any) => {
  try {
    const clerkUserId = req.auth.userId;
    const { message, response } = req.body;
    
    const result = await query(
      'INSERT INTO chatbot_logs (clerk_user_id, message, response) VALUES ($1, $2, $3) RETURNING *',
      [clerkUserId, message, response]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error saving chat message:', error);
    res.status(500).json({ error: 'Failed to save chat message' });
  }
});

// Delete chat history
router.delete('/', async (req: any, res: any) => {
  try {
    const clerkUserId = req.auth.userId;
    
    await query(
      'DELETE FROM chatbot_logs WHERE clerk_user_id = $1',
      [clerkUserId]
    );
    
    res.json({ message: 'Chat history deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat history:', error);
    res.status(500).json({ error: 'Failed to delete chat history' });
  }
});

export default router;
