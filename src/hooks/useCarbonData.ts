import { useState, useEffect } from 'react';
import { CarbonFootprintData } from '../types';

export const useCarbonData = () => {
  const [data, setData] = useState<CarbonFootprintData[]>([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [weeklyTotal, setWeeklyTotal] = useState(0);

  useEffect(() => {
    // Generate mock data for the last 7 days
    const generateMockData = () => {
      const mockData: CarbonFootprintData[] = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const transport = Math.random() * 15 + 5;
        const energy = Math.random() * 12 + 8;
        const food = Math.random() * 10 + 6;
        const waste = Math.random() * 5 + 2;
        const total = transport + energy + food + waste;
        
        mockData.push({
          date: date.toISOString().split('T')[0],
          transport,
          energy,
          food,
          waste,
          total
        });
      }
      
      return mockData;
    };

    const mockData = generateMockData();
    setData(mockData);
    setTodayTotal(mockData[mockData.length - 1]?.total || 0);
    setWeeklyTotal(mockData.reduce((sum, day) => sum + day.total, 0));
  }, []);

  return { data, todayTotal, weeklyTotal };
};