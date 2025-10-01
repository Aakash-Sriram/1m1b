import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Your Neon DB URL
  ssl: {
    rejectUnauthorized: false, // Neon requires SSL
  },
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

/*
-- Profiles (extra info beyond Clerk)
CREATE TABLE profiles (
    clerk_user_id VARCHAR(255) PRIMARY KEY, -- directly Clerk ID
    display_name VARCHAR(100),
    preferences JSONB,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chatbot logs
CREATE TABLE chatbot_logs (
    id SERIAL PRIMARY KEY,
    clerk_user_id VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Suggestions
CREATE TABLE ai_suggestions (
    id SERIAL PRIMARY KEY,
    clerk_user_id VARCHAR(255) NOT NULL,
    suggestion TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Model Results
CREATE TABLE ai_model_results (
    id SERIAL PRIMARY KEY,
    clerk_user_id VARCHAR(255) NOT NULL,
    input_data JSONB,
    result_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
these are the tables i have created in neon db
*/