# EcoTracker - Full Stack Application with Clerk Auth & PostgreSQL

## 🚀 Complete Setup Guide

### **Prerequisites**
- Node.js (v18 or higher)
- PostgreSQL database (Neon recommended)
- Clerk account for authentication

### **1. Environment Setup**

Create/update your `.env.local` file:

```bash
# Clerk Configuration
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database Configuration
DATABASE_URL=postgresql://neondb_owner:npg_SctbFGxaJY15@ep-divine-fog-ad5fq1s8-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# API Configuration
VITE_API_BASE_URL=http://localhost:3001
```

### **2. Database Setup**

Your Neon database should have these tables:

```sql
-- =============================================
-- ECO TRACKER - COMPLETE DATABASE SETUP
-- =============================================
-- =============================================
-- TABLE 1: User Profiles
-- =============================================
CREATE TABLE profiles (
    clerk_user_id VARCHAR(255) PRIMARY KEY,
    display_name VARCHAR(100),
    preferences JSONB,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE 2: Chatbot Logs
-- =============================================
CREATE TABLE chatbot_logs (
    id SERIAL PRIMARY KEY,
    clerk_user_id VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE 3: AI Suggestions
-- =============================================
CREATE TABLE ai_suggestions (
    id SERIAL PRIMARY KEY,
    clerk_user_id VARCHAR(255) NOT NULL,
    suggestion TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE 4: AI Model Results
-- =============================================
CREATE TABLE ai_model_results (
    id SERIAL PRIMARY KEY,
    clerk_user_id VARCHAR(255) NOT NULL,
    input_data JSONB,
    result_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE 5: Carbon Entries (USER ACTIVITIES)
-- =============================================
CREATE TABLE carbon_entries (
    id SERIAL PRIMARY KEY,
    clerk_user_id VARCHAR(255) NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    activity_value DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    calculated_co2 DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE 6: AI Analysis Results
-- =============================================
CREATE TABLE ai_analysis (
    id SERIAL PRIMARY KEY,
    clerk_user_id VARCHAR(255) NOT NULL,
    total_co2 DECIMAL(10,2) NOT NULL,
    breakdown JSONB NOT NULL,
    insights TEXT[] NOT NULL,
    predictions JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- PERFORMANCE INDEXES
-- =============================================

-- Profiles indexes
CREATE INDEX idx_profiles_user_id ON profiles(clerk_user_id);

-- Chatbot logs indexes
CREATE INDEX idx_chatbot_logs_user_id ON chatbot_logs(clerk_user_id);
CREATE INDEX idx_chatbot_logs_created_at ON chatbot_logs(created_at);

-- AI Suggestions indexes
CREATE INDEX idx_ai_suggestions_user_id ON ai_suggestions(clerk_user_id);
CREATE INDEX idx_ai_suggestions_status ON ai_suggestions(status);
CREATE INDEX idx_ai_suggestions_created_at ON ai_suggestions(created_at);

-- AI Model Results indexes
CREATE INDEX idx_ai_model_results_user_id ON ai_model_results(clerk_user_id);
CREATE INDEX idx_ai_model_results_created_at ON ai_model_results(created_at);

-- Carbon Entries indexes
CREATE INDEX idx_carbon_entries_user_id ON carbon_entries(clerk_user_id);
CREATE INDEX idx_carbon_entries_created_at ON carbon_entries(created_at);
CREATE INDEX idx_carbon_entries_category ON carbon_entries(category);
CREATE INDEX idx_carbon_entries_activity_type ON carbon_entries(activity_type);

-- AI Analysis indexes
CREATE INDEX idx_ai_analysis_user_id ON ai_analysis(clerk_user_id);
CREATE INDEX idx_ai_analysis_created_at ON ai_analysis(created_at);

-- =============================================
-- SAMPLE DATA FOR TESTING (OPTIONAL)
-- =============================================

-- Sample profile
INSERT INTO profiles (clerk_user_id, display_name, preferences) 
VALUES ('user_123', 'Eco User', '{"weekly_goal": 150, "notifications": true}')
ON CONFLICT (clerk_user_id) DO NOTHING;

-- Sample carbon entries
INSERT INTO carbon_entries (clerk_user_id, activity_type, activity_value, unit, calculated_co2, category) VALUES
('user_123', 'car_drive', 15.0, 'km', 3.15, 'transport'),
('user_123', 'gas_cooking', 0.5, 'hour', 1.0, 'energy'),
('user_123', 'beef_consumption', 0.2, 'kg', 5.4, 'food'),
('user_123', 'electricity_usage', 8.5, 'kwh', 7.23, 'energy'),
('user_123', 'bus_ride', 10.0, 'km', 1.05, 'transport');

-- Sample AI analysis
INSERT INTO ai_analysis (clerk_user_id, total_co2, breakdown, insights, predictions) VALUES
('user_123', 17.83, 
 '{"transport": 4.2, "energy": 8.23, "food": 5.4}', 
 '{"High energy usage detected", "Good transportation choices"}',
 '{"2024-01-16": 16.5, "2024-01-17": 15.8, "2024-01-18": 14.2}'
);

-- =============================================
-- VERIFICATION QUERY
-- =============================================

SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
ORDER BY table_name;

-- =============================================
-- TABLE STRUCTURE VERIFICATION
-- =============================================

SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
```

### **3. Installation**

```bash
npm install
```

### **4. Running the Application**

#### Option 1: Run Everything Together (Recommended)
```bash
npm run dev:full
```
This starts both the React frontend (port 5173) and Express backend (port 3001).

#### Option 2: Run Separately
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run backend:dev
```

### **5. Application Structure**

```
project/
├── src/                          # React frontend
│   ├── components/               # React components
│   ├── hooks/                    # Custom hooks
│   ├── services/                 # API services
│   └── types/                    # TypeScript types
├── backend/                      # Express backend
│   ├── db.ts                     # Database connection
│   ├── server.ts                 # Express server
│   └── api/                      # API routes
└── .env.local                    # Environment variables
```

### **6. API Endpoints**

All endpoints expect a Clerk user ID in the URL path:

- **Profiles**
  - `GET /api/profiles/:clerkUserId` - Get user profile
  - `PUT /api/profiles/:clerkUserId` - Update user profile

- **Chat**
  - `GET /api/chat/:clerkUserId` - Get chat history
  - `POST /api/chat/:clerkUserId` - Save chat message

- **Suggestions**
  - `GET /api/suggestions/:clerkUserId` - Get AI suggestions
  - `POST /api/suggestions/:clerkUserId` - Create new suggestion

- **AI Results**
  - `GET /api/ai-results/:clerkUserId` - Get AI model results
  - `POST /api/ai-results/:clerkUserId` - Save AI result

### **7. Using the API in Components**

Import and use the custom hooks:

```tsx
import { useProfile, useChat, useSuggestions, useAIResults } from '../hooks/useApi';

const MyComponent = () => {
  const { profile, updateProfile } = useProfile();
  const { messages, saveChatMessage } = useChat();
  const { suggestions, createSuggestion } = useSuggestions();
  const { results, saveAIResult } = useAIResults();

  // Use the data and functions as needed
};
```

### **8. Authentication Flow**

1. **Sign Out**: Users see Clerk's sign-in component
2. **Sign In**: Users access the full app with their data
3. **Automatic Profile Creation**: Profiles are created automatically on first API call
4. **Data Isolation**: All data is isolated by Clerk user ID

### **9. Database Integration Examples**

#### Save Chat Message
```tsx
const { saveChatMessage } = useChat();

const handleSendMessage = async (message: string, response: string) => {
  try {
    await saveChatMessage(message, response);
    console.log('Message saved to database');
  } catch (error) {
    console.error('Failed to save message:', error);
  }
};
```

#### Update User Profile
```tsx
const { updateProfile } = useProfile();

const handleUpdateProfile = async () => {
  try {
    await updateProfile({
      display_name: 'New Name',
      preferences: { theme: 'dark', notifications: true }
    });
    console.log('Profile updated');
  } catch (error) {
    console.error('Failed to update profile:', error);
  }
};
```

### **10. Development URLs**

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### **11. Next Steps**

1. **Replace AI responses** with actual AI service calls
2. **Add authentication middleware** for additional security
3. **Implement real-time features** with WebSockets
4. **Add data validation** with Zod or similar
5. **Set up production deployment** on Vercel/Railway/etc.

### **12. Troubleshooting**

- **Database connection errors**: Check your DATABASE_URL in .env.local
- **Clerk authentication errors**: Verify your Clerk keys
- **CORS errors**: Ensure VITE_API_BASE_URL is correct
- **Build errors**: Make sure all dependencies are installed

---

## 🎉 Your app is now fully integrated with:
- ✅ Clerk Authentication
- ✅ PostgreSQL Database
- ✅ Full-stack API
- ✅ Real data persistence
- ✅ User-specific data isolation
