import express from 'express';
import { query } from '../db';
import { AIAnalysisService } from '../services/aiAnalysis';

const router = express.Router();

// Get AI analysis and predictions
router.get('/', async (req: any, res: any) => {
  try {
    const clerkUserId = req.auth.userId;

    const analysis = await AIAnalysisService.analyzeUserData(clerkUserId);

    // Save analysis to database
    await query(
      `INSERT INTO ai_analysis 
       (clerk_user_id, total_co2, breakdown, insights, predictions) 
       VALUES ($1, $2, $3, $4, $5)`,
      [clerkUserId, analysis.total_co2, analysis.breakdown, analysis.insights, analysis.predictions]
    );

    res.json(analysis);
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    res.status(500).json({ error: 'Failed to generate AI analysis' });
  }
});

// Get analysis history
router.get('/history', async (req: any, res: any) => {
  try {
    const clerkUserId = req.auth.userId;
    const { limit = 10 } = req.query;

    const result = await query(
      `SELECT * FROM ai_analysis 
       WHERE clerk_user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [clerkUserId, limit]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching analysis history:', error);
    res.status(500).json({ error: 'Failed to fetch analysis history' });
  }
});

export default router;