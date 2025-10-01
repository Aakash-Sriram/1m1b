import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Target, Award, Calendar } from 'lucide-react';
import { useCarbonData } from '../../hooks/useCarbonData';
import CarbonChart from './CarbonChart';
import ProgressCard from './ProgressCard';
import SummaryCard from './SummaryCard';
import { ActivityInput } from '../ActivityInput';

const Dashboard: React.FC = () => {
  const { data, todayTotal, weeklyTotal, loading } = useCarbonData();
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const weeklyGoal = 150; // kg CO2
  const progressPercentage = Math.min((weeklyTotal / weeklyGoal) * 100, 100);
  const isOnTrack = weeklyTotal < weeklyGoal;

  // Refresh data when new activities might be added
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Loading Dashboard...</h2>
          <p className="text-gray-600">Fetching your carbon data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
            Your Carbon Footprint Dashboard
          </h1>
          <p className="text-gray-600">
            Track your daily impact and work towards your sustainability goals.
          </p>
        </motion.div>

        {/* Summary Cards - Mobile: Stack, Desktop: Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Today's Total"
            value={`${todayTotal.toFixed(1)} kg`}
            subtitle="CO₂ Emissions"
            icon={Calendar}
            color="blue"
            trend="-5.2%"
            delay={0.1}
          />
          <SummaryCard
            title="Weekly Total"
            value={`${weeklyTotal.toFixed(1)} kg`}
            subtitle="CO₂ Emissions"
            icon={TrendingDown}
            color="green"
            trend="-12.3%"
            delay={0.2}
          />
          <SummaryCard
            title="Weekly Goal"
            value={`${weeklyGoal} kg`}
            subtitle="Target Limit"
            icon={Target}
            color="purple"
            trend={`${progressPercentage.toFixed(0)}% used`}
            delay={0.3}
          />
          <SummaryCard
            title="Eco Score"
            value="B+"
            subtitle="Keep it up!"
            icon={Award}
            color="orange"
            trend="Improved"
            delay={0.4}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts - Mobile: Full width stack, Desktop: 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            <CarbonChart data={data} />
          </div>

          {/* Progress and Insights - Mobile: Full width, Desktop: 1/3 width */}
          <div className="space-y-6">
            <ProgressCard
              weeklyTotal={weeklyTotal}
              weeklyGoal={weeklyGoal}
              isOnTrack={isOnTrack}
            />
            
            {/* Insights Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                💡 Today's Insights
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Great job!</span> Your transport emissions are 23% lower than yesterday.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Tip:</span> Consider using public transport tomorrow to reduce emissions further.
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl border-l-4 border-orange-500">
                  <p className="text-sm text-orange-800">
                    <span className="font-medium">Food Impact:</span> Plant-based meals can reduce your food footprint by up to 40%.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <ActivityInput />
    </div>
  );
};

export default Dashboard;