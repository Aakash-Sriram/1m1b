import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  BarChart3,
  Target,
  Calendar,
  Zap
} from 'lucide-react';
import { AIModelResult } from '../../types';

const AIResultsPage: React.FC = () => {
  const [results, setResults] = useState<AIModelResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate AI model computation
    const timer = setTimeout(() => {
      const mockResults: AIModelResult = {
        predictedCO2: 32.4,
        confidence: 87.5,
        breakdown: {
          transport: 18.2,
          energy: 9.7,
          food: 3.8,
          waste: 0.7
        },
        recommendations: [
          "Consider cycling for trips under 5km to reduce transport emissions by 15%",
          "Your energy usage is higher than average - check for energy vampires",
          "Great job on food choices! You're 23% below average for food emissions",
          "Small improvement: Try composting to reduce waste emissions further"
        ]
      };
      setResults(mockResults);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            AI Analysis in Progress
          </h2>
          <p className="text-gray-600 mb-6">
            Analyzing your patterns and calculating predictions...
          </p>
          <div className="flex space-x-2 justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </motion.div>
      </div>
    );
  }

  if (!results) return null;

  const breakdownData = [
    { category: 'Transport', value: results.breakdown.transport, color: 'bg-blue-500', icon: '🚗' },
    { category: 'Energy', value: results.breakdown.energy, color: 'bg-yellow-500', icon: '⚡' },
    { category: 'Food', value: results.breakdown.food, color: 'bg-green-500', icon: '🍽️' },
    { category: 'Waste', value: results.breakdown.waste, color: 'bg-purple-500', icon: '🗑️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-6 h-6 text-green-600" />
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
              AI Model Results
            </h1>
          </div>
          <p className="text-gray-600">
            Detailed analysis of your carbon footprint patterns and future predictions.
          </p>
        </motion.div>

        {/* Mobile: Stacked Cards, Desktop: Grid Layout */}
        <div className="space-y-6 lg:space-y-8">
          {/* Prediction Summary - Mobile: Card, Desktop: Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg text-white p-6 lg:p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                  Today's Prediction
                </h2>
                <p className="text-green-100 mb-4">
                  Based on your activity patterns and historical data
                </p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl lg:text-5xl font-bold">
                    {results.predictedCO2}
                  </span>
                  <span className="text-xl text-green-100">kg CO₂</span>
                </div>
                <div className="flex items-center space-x-2 mt-3">
                  <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                  <span className="text-sm text-green-100">
                    {results.confidence}% confidence level
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-end">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 lg:w-12 lg:h-12" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Breakdown Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Mobile: Single Column Cards, Desktop: Table */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-center space-x-2 mb-6">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Emissions Breakdown
                </h3>
              </div>

              {/* Mobile: Stacked Cards */}
              <div className="space-y-4 lg:hidden">
                {breakdownData.map((item, index) => (
                  <motion.div
                    key={item.category}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="p-4 border border-gray-100 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium text-gray-800">{item.category}</span>
                      </div>
                      <span className="text-lg font-bold text-gray-800">
                        {item.value.toFixed(1)} kg
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.value / results.predictedCO2) * 100}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        className={`h-2 rounded-full ${item.color}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Desktop: Table */}
              <div className="hidden lg:block">
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-3 text-sm font-medium text-gray-600">Category</th>
                        <th className="text-right py-3 text-sm font-medium text-gray-600">Amount</th>
                        <th className="text-right py-3 text-sm font-medium text-gray-600">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {breakdownData.map((item, index) => (
                        <motion.tr
                          key={item.category}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="border-b border-gray-50 hover:bg-gray-50"
                        >
                          <td className="py-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">{item.icon}</span>
                              <span className="font-medium text-gray-800">{item.category}</span>
                            </div>
                          </td>
                          <td className="text-right py-4 font-semibold text-gray-800">
                            {item.value.toFixed(1)} kg
                          </td>
                          <td className="text-right py-4">
                            <div className="flex items-center justify-end space-x-2">
                              <div className="w-12 bg-gray-200 rounded-full h-2">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(item.value / results.predictedCO2) * 100}%` }}
                                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                                  className={`h-2 rounded-full ${item.color}`}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-10 text-right">
                                {((item.value / results.predictedCO2) * 100).toFixed(0)}%
                              </span>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {/* Confidence & Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Confidence Score */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Model Confidence
                  </h3>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {results.confidence}%
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Prediction accuracy based on historical data
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${results.confidence}%` }}
                      transition={{ delay: 0.8, duration: 1 }}
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Today's Status
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-800">Below weekly average</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm text-yellow-800">Energy usage elevated</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-blue-800">On track for weekly goal</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                AI Recommendations
              </h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {results.recommendations.map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 border border-gray-100 rounded-xl hover:border-green-200 hover:bg-green-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-600">{index + 1}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {recommendation}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AIResultsPage;