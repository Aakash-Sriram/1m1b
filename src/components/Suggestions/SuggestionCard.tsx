import React from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Home, 
  Utensils, 
  Recycle, 
  ChevronRight,
  TrendingDown 
} from 'lucide-react';
import { EcoSuggestion } from '../../types';

interface SuggestionCardProps {
  suggestion: EcoSuggestion;
  index: number;
  onSelect: (suggestion: EcoSuggestion) => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ 
  suggestion, 
  index, 
  onSelect 
}) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'transport': return Car;
      case 'energy': return Home;
      case 'food': return Utensils;
      case 'waste': return Recycle;
      default: return TrendingDown;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'transport': return 'from-blue-500 to-blue-600';
      case 'energy': return 'from-yellow-500 to-yellow-600';
      case 'food': return 'from-green-500 to-green-600';
      case 'waste': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const Icon = getIcon(suggestion.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
      onClick={() => onSelect(suggestion)}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getCategoryColor(suggestion.category)} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(suggestion.difficulty)}`}>
              {suggestion.difficulty}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">
          {suggestion.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          {suggestion.description}
        </p>

        {/* Impact */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingDown className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">
              -{suggestion.impact}kg CO₂/week
            </span>
          </div>
          <span className="text-xs text-gray-500 capitalize">
            {suggestion.category}
          </span>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="h-1 bg-gradient-to-r from-green-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </motion.div>
  );
};

export default SuggestionCard;