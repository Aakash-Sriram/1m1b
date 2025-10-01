export interface User {
  id: string;
  email: string;
  name: string;
  joinedDate: string;
  weeklyGoal: number;
}

export interface CarbonFootprintData {
  date: string;
  transport: number;
  energy: number;
  food: number;
  waste: number;
  total: number;
}

export interface EcoSuggestion {
  id: string;
  title: string;
  description: string;
  impact: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'transport' | 'energy' | 'food' | 'waste';
  icon: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface AIModelResult {
  predictedCO2: number;
  confidence: number;
  breakdown: {
    transport: number;
    energy: number;
    food: number;
    waste: number;
  };
  recommendations: string[];
}