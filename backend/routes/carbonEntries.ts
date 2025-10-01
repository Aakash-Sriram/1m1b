import express from 'express';
import { query } from '../db';
import { CarbonCalculator } from '../services/carbonCalculator';

const router = express.Router();

// Add carbon activity
router.post('/', async (req: any, res: any) => {
  try {
    const clerkUserId = req.auth.userId;
    const { activity_type, activity_value, unit } = req.body;

    const result = CarbonCalculator.calculateCO2({
      activity_type,
      activity_value: parseFloat(activity_value),
      unit
    });

    const dbResult = await query(
      `INSERT INTO carbon_entries 
       (clerk_user_id, activity_type, activity_value, unit, calculated_co2, category) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [clerkUserId, activity_type, activity_value, unit, result.calculated_co2, result.category]
    );

    res.json(dbResult.rows[0]);
  } catch (error) {
    console.error('Error saving carbon entry:', error);
    res.status(500).json({ error: 'Failed to save carbon entry' });
  }
});

// Get user's carbon entries
router.get('/', async (req: any, res: any) => {
  try {
    const clerkUserId = req.auth.userId;
    const { days = 7 } = req.query;

    const result = await query(
      `SELECT * FROM carbon_entries 
       WHERE clerk_user_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '${days} days'
       ORDER BY created_at DESC`,
      [clerkUserId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching carbon entries:', error);
    res.status(500).json({ error: 'Failed to fetch carbon entries' });
  }
});

// Get daily totals for dashboard
router.get('/daily-totals', async (req: any, res: any) => {
  try {
    const clerkUserId = req.auth.userId;
    const { days = 7 } = req.query;

    const result = await query(
      `SELECT 
         DATE(created_at) as date,
         SUM(calculated_co2) as total_co2,
         COUNT(*) as activity_count
       FROM carbon_entries 
       WHERE clerk_user_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '${days} days'
       GROUP BY DATE(created_at)
       ORDER BY date`,
      [clerkUserId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching daily totals:', error);
    res.status(500).json({ error: 'Failed to fetch daily totals' });
  }
});

// Get category breakdown
router.get('/breakdown', async (req: any, res: any) => {
  try {
    const clerkUserId = req.auth.userId;
    const { days = 7 } = req.query;

    const result = await query(
      `SELECT 
         category,
         SUM(calculated_co2) as total_co2,
         COUNT(*) as activity_count
       FROM carbon_entries 
       WHERE clerk_user_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '${days} days'
       GROUP BY category`,
      [clerkUserId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching breakdown:', error);
    res.status(500).json({ error: 'Failed to fetch breakdown' });
  }
});

export default router;