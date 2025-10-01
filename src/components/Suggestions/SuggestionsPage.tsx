import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  Search, 
  Sparkles, 
  X,
  CheckCircle
} from 'lucide-react';
import { EcoSuggestion } from '../../types';
import SuggestionCard from './SuggestionCard';

const SuggestionsPage: React.FC = () => {
  const [suggestions, setSuggestions] = useState<EcoSuggestion[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<EcoSuggestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<EcoSuggestion | null>(null);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'transport', label: 'Transport' },
    { value: 'energy', label: 'Energy' },
    { value: 'food', label: 'Food' },
    { value: 'waste', label: 'Waste' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' }
  ];

  useEffect(() => {
    // Mock data for eco suggestions
    const mockSuggestions: EcoSuggestion[] = [
      {
        id: '1',
        title: 'Switch to Cycling',
        description: 'Replace short car trips (under 5km) with cycling. Great for health and environment!',
        impact: 12.5,
        difficulty: 'Easy',
        category: 'transport',
        icon: '🚴‍♀️'
      },
      {
        id: '2',
        title: 'Use Public Transport',
        description: 'Take the bus or train instead of driving. Reduces individual carbon footprint significantly.',
        impact: 8.3,
        difficulty: 'Easy',
        category: 'transport',
        icon: '🚌'
      },
      {
        id: '3',
        title: 'Install Solar Panels',
        description: 'Generate clean energy for your home. High upfront cost but excellent long-term benefits.',
        impact: 25.7,
        difficulty: 'Hard',
        category: 'energy',
        icon: '☀️'
      },
      {
        id: '4',
        title: 'LED Light Bulbs',
        description: 'Replace all incandescent bulbs with LED alternatives. 75% less energy consumption.',
        impact: 5.2,
        difficulty: 'Easy',
        category: 'energy',
        icon: '💡'
      },
      {
        id: '5',
        title: 'Meatless Mondays',
        description: 'Go vegetarian one day per week. Livestock farming has a huge environmental impact.',
        impact: 15.4,
        difficulty: 'Medium',
        category: 'food',
        icon: '🌱'
      },
      {
        id: '6',
        title: 'Composting',
        description: 'Turn food scraps into nutrient-rich soil. Reduces methane emissions from landfills.',
        impact: 7.8,
        difficulty: 'Medium',
        category: 'waste',
        icon: '♻️'
      },
      {
        id: '7',
        title: 'Smart Thermostat',
        description: 'Optimize heating and cooling automatically. Learn your schedule and preferences.',
        impact: 18.6,
        difficulty: 'Medium',
        category: 'energy',
        icon: '🌡️'
      },
      {
        id: '8',
        title: 'Buy Local Produce',
        description: 'Support local farmers and reduce transportation emissions from food delivery.',
        impact: 6.9,
        difficulty: 'Easy',
        category: 'food',
        icon: '🥕'
      },
      {
        id: '9',
        title: 'Electric Vehicle',
        description: 'Switch to an electric or hybrid car. Zero direct emissions and lower operating costs.',
        impact: 45.2,
        difficulty: 'Hard',
        category: 'transport',
        icon: '⚡'
      }
    ];
    
    setSuggestions(mockSuggestions);
    setFilteredSuggestions(mockSuggestions);
  }, []);

  useEffect(() => {
    let filtered = suggestions;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(s => s.difficulty === selectedDifficulty);
    }

    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSuggestions(filtered);
  }, [selectedCategory, selectedDifficulty, searchTerm, suggestions]);

  const handleSuggestionSelect = (suggestion: EcoSuggestion) => {
    setSelectedSuggestion(suggestion);
  };

  const closeSuggestionDetail = () => {
    setSelectedSuggestion(null);
  };

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
            <Sparkles className="w-6 h-6 text-green-600" />
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
              AI-Powered Eco Suggestions
            </h1>
          </div>
          <p className="text-gray-600">
            Personalized recommendations to reduce your carbon footprint based on your activity patterns.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-md p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search suggestions..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {difficulties.map(diff => (
                  <option key={diff.value} value={diff.value}>
                    {diff.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-sm text-gray-600">
            Showing {filteredSuggestions.length} suggestion{filteredSuggestions.length !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </motion.div>

        {/* Suggestions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuggestions.map((suggestion, index) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              index={index}
              onSelect={handleSuggestionSelect}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredSuggestions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No suggestions found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search term.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Clear all filters
            </button>
          </motion.div>
        )}

        {/* Suggestion Detail Modal */}
        <AnimatePresence>
          {selectedSuggestion && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={closeSuggestionDetail}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl shadow-2xl z-50 overflow-y-auto"
              >
                <div className="p-6 lg:p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{selectedSuggestion.icon}</div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          {selectedSuggestion.title}
                        </h2>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            -{selectedSuggestion.impact}kg CO₂/week
                          </span>
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
                            {selectedSuggestion.difficulty}
                          </span>
                          <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full capitalize">
                            {selectedSuggestion.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={closeSuggestionDetail}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {selectedSuggestion.description}
                    </p>

                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Environmental Impact</h3>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-800 font-medium">
                          Reduces your weekly emissions by {selectedSuggestion.impact}kg CO₂
                        </span>
                      </div>
                      <p className="text-sm text-green-700 mt-2">
                        That's equivalent to driving {(selectedSuggestion.impact * 4.3).toFixed(0)}km less per week!
                      </p>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Getting Started</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Step 1:</span> Research and plan your approach
                        </p>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                        <p className="text-sm text-yellow-800">
                          <span className="font-medium">Step 2:</span> Start with small changes and build momentum
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <p className="text-sm text-green-800">
                          <span className="font-medium">Step 3:</span> Track your progress and celebrate milestones
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-8">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all"
                      onClick={closeSuggestionDetail}
                    >
                      I'll Try This! 🌱
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SuggestionsPage;