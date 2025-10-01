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
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# API Configuration
VITE_API_BASE_URL=http://localhost:3001
```

### **2. Database Setup**

Your Neon database should have these tables:

```sql
-- Profiles (extra info beyond Clerk)
CREATE TABLE profiles (
    clerk_user_id VARCHAR(255) PRIMARY KEY,
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
