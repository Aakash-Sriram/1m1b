import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';

export interface CarbonActivity {
  activity_type: string;
  activity_value: number;
  unit: string;
}

export const useCarbonEntries = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addCarbonEntry = async (activity: CarbonActivity) => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/carbon-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activity),
      });

      if (!response.ok) {
        throw new Error('Failed to save activity');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save activity');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDailyTotals = async (days: number = 7) => {
    if (!user?.id) return [];
    
    try {
      const response = await fetch(`/api/carbon-entries/daily-totals?days=${days}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch daily totals');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      return [];
    }
  };

  const getCategoryBreakdown = async (days: number = 7) => {
    if (!user?.id) return [];
    
    try {
      const response = await fetch(`/api/carbon-entries/breakdown?days=${days}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch breakdown');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      return [];
    }
  };

  return {
    addCarbonEntry,
    getDailyTotals,
    getCategoryBreakdown,
    loading,
    error
  };
};