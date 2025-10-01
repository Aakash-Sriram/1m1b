import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, TrendingDown } from 'lucide-react';

interface ProgressCardProps {
  weeklyTotal: number;
  weeklyGoal: number;
  isOnTrack: boolean;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ weeklyTotal, weeklyGoal, isOnTrack }) => {
  const progressPercentage = Math.min((weeklyTotal / weeklyGoal) * 100, 100);
  const remaining = Math.max(weeklyGoal - weeklyTotal, 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Weekly Progress</h3>
        <div className={`p-2 rounded-lg ${
          isOnTrack ? 'bg-green-100' : 'bg-orange-100'
        }`}>
          <Target className={`w-5 h-5 ${
            isOnTrack ? 'text-green-600' : 'text-orange-600'
          }`} />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Current: {weeklyTotal.toFixed(1)} kg CO₂</span>
          <span>Goal: {weeklyGoal} kg CO₂</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${
              progressPercentage < 75 ? 'bg-green-500' :
              progressPercentage < 90 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span className="font-medium">{progressPercentage.toFixed(0)}%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Status */}
      <div className={`p-4 rounded-xl flex items-start space-x-3 ${
        isOnTrack ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
      }`}>
        {isOnTrack ? (
          <TrendingDown className="w-5 h-5 text-green-600 mt-0.5" />
        ) : (
          <TrendingUp className="w-5 h-5 text-orange-600 mt-0.5" />
        )}
        <div className="flex-1">
          <p className={`text-sm font-medium ${
            isOnTrack ? 'text-green-800' : 'text-orange-800'
          }`}>
            {isOnTrack ? 'On Track! 🎯' : 'Above Target ⚠️'}
          </p>
          <p className={`text-xs mt-1 ${
            isOnTrack ? 'text-green-600' : 'text-orange-600'
          }`}>
            {isOnTrack 
              ? `You have ${remaining.toFixed(1)} kg CO₂ remaining this week.`
              : `You've exceeded your goal by ${(weeklyTotal - weeklyGoal).toFixed(1)} kg CO₂.`
            }
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-600 mb-2">Quick improvements:</p>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            🚶 Walk more
          </span>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            🌱 Plant-based meal
          </span>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
            ♻️ Recycle better
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressCard;