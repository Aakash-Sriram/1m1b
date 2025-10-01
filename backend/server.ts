import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Import routes
import profilesRouter from './routes/profiles';
import chatRouter from './routes/chat';
import suggestionsRouter from './routes/suggestions';
import aiResultsRouter from './routes/ai-results';
import carbonEntriesRouter from './routes/carbonEntries';
import aiAnalysisRouter from './routes/aiAnalysis';

// Add this import for the query function (adjust path as needed)
import { query } from './db';

// Health check (public)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Protected routes with Clerk auth
app.use('/api/profiles', ClerkExpressRequireAuth(), profilesRouter);
app.use('/api/chat', ClerkExpressRequireAuth(), chatRouter);
app.use('/api/suggestions', ClerkExpressRequireAuth(), suggestionsRouter);
app.use('/api/ai-results', ClerkExpressRequireAuth(), aiResultsRouter);
app.use('/api/carbon-entries', ClerkExpressRequireAuth(), carbonEntriesRouter);
app.use('/api/ai-analysis', ClerkExpressRequireAuth(), aiAnalysisRouter);

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// User Profile API
app.get('/api/profiles/:clerkUserId', async (req, res) => {
  try {
    const { clerkUserId } = req.params;
    
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

app.put('/api/profiles/:clerkUserId', async (req, res) => {
  try {
    const { clerkUserId } = req.params;
    const { display_name, preferences } = req.body;
    
    const result = await query(
      'UPDATE profiles SET display_name = $1, preferences = $2, updated_at = CURRENT_TIMESTAMP WHERE clerk_user_id = $3 RETURNING *',
      [display_name, preferences, clerkUserId]
    );
    
    if (result.rows.length === 0) {
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

// Chat API
app.get('/api/chat/:clerkUserId', async (req, res) => {
  try {
    const { clerkUserId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    
    const result = await query(
      'SELECT * FROM chatbot_logs WHERE clerk_user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [clerkUserId, limit]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

app.post('/api/chat/:clerkUserId', async (req, res) => {
  try {
    const { clerkUserId } = req.params;
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

// Suggestions API
app.get('/api/suggestions/:clerkUserId', async (req, res) => {
  try {
    const { clerkUserId } = req.params;
    
    const result = await query(
      'SELECT * FROM ai_suggestions WHERE clerk_user_id = $1 ORDER BY created_at DESC',
      [clerkUserId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

app.post('/api/suggestions/:clerkUserId', async (req, res) => {
  try {
    const { clerkUserId } = req.params;
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

// AI Results API
app.get('/api/ai-results/:clerkUserId', async (req, res) => {
  try {
    const { clerkUserId } = req.params;
    
    const result = await query(
      'SELECT * FROM ai_model_results WHERE clerk_user_id = $1 ORDER BY created_at DESC',
      [clerkUserId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching AI results:', error);
    res.status(500).json({ error: 'Failed to fetch AI results' });
  }
});

app.post('/api/ai-results/:clerkUserId', async (req, res) => {
  try {
    const { clerkUserId } = req.params;
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


export default app;
