import { useState, useEffect } from 'react';
import { CarbonFootprintData } from '../types';

export const useCarbonData = () => {
  const [data, setData] = useState<CarbonFootprintData[]>([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/carbon-entries/daily-totals?days=7');
      
      if (response.ok) {
        const dailyData = await response.json();
        
        // Transform data for the chart
        const chartData = dailyData.map((day: any) => ({
          date: new Date(day.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
          transport: 0, // You'll need to get category breakdown
          energy: 0,
          food: 0,
          waste: 0,
          total: parseFloat(day.total_co2) || 0
        }));
        
        setData(chartData);
        setTodayTotal(chartData[chartData.length - 1]?.total || 0);
        setWeeklyTotal(chartData.reduce((sum: number, day: any) => sum + day.total, 0));
      } else {
        // Fallback to mock data if API fails
        generateMockData();
      }
    } catch (error) {
      console.error('Error fetching carbon data:', error);
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Mock data fallback
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
    
    setData(mockData);
    setTodayTotal(mockData[mockData.length - 1]?.total || 0);
    setWeeklyTotal(mockData.reduce((sum, day) => sum + day.total, 0));
  };

  return { data, todayTotal, weeklyTotal, loading, refetch: fetchData };
};