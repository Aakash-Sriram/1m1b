import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { apiService } from '../services/api';

// Hook for user profile management
export const useProfile = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const profileData = await apiService.getProfile(user.id);
      setProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: { display_name: string; preferences: Record<string, unknown> }) => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const updatedProfile = await apiService.updateProfile(user.id, data);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  return { profile, loading, error, updateProfile, refetch: fetchProfile };
};

// Hook for chat history
export const useChat = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChatHistory = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const chatData = await apiService.getChatHistory(user.id);
      setMessages(chatData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chat history');
    } finally {
      setLoading(false);
    }
  };

  const saveChatMessage = async (message: string, response: string) => {
    if (!user?.id) return;
    
    try {
      const savedMessage = await apiService.saveChatMessage(user.id, message, response);
      setMessages(prev => [savedMessage, ...prev]);
      return savedMessage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save message');
      throw err;
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, [user?.id]);

  return { messages, loading, error, saveChatMessage, refetch: fetchChatHistory };
};

// Hook for AI suggestions
export const useSuggestions = () => {
  const { user } = useUser();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const suggestionsData = await apiService.getSuggestions(user.id);
      setSuggestions(suggestionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch suggestions');
    } finally {
      setLoading(false);
    }
  };

  const createSuggestion = async (suggestion: string, status = 'pending') => {
    if (!user?.id) return;
    
    try {
      const newSuggestion = await apiService.createSuggestion(user.id, suggestion, status);
      setSuggestions(prev => [newSuggestion, ...prev]);
      return newSuggestion;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create suggestion');
      throw err;
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [user?.id]);

  return { suggestions, loading, error, createSuggestion, refetch: fetchSuggestions };
};

// Hook for AI results
export const useAIResults = () => {
  const { user } = useUser();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAIResults = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const resultsData = await apiService.getAIResults(user.id);
      setResults(resultsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch AI results');
    } finally {
      setLoading(false);
    }
  };

  const saveAIResult = async (inputData: Record<string, unknown>, resultData: Record<string, unknown>) => {
    if (!user?.id) return;
    
    try {
      const newResult = await apiService.saveAIResult(user.id, inputData, resultData);
      setResults(prev => [newResult, ...prev]);
      return newResult;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save AI result');
      throw err;
    }
  };

  useEffect(() => {
    fetchAIResults();
  }, [user?.id]);

  return { results, loading, error, saveAIResult, refetch: fetchAIResults };
};
