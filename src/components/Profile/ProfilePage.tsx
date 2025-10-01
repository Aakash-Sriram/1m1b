import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Target, 
  Save,
  Camera,
  Award,
  TrendingUp,
  Leaf
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    weeklyGoal: user?.weeklyGoal || 150,
    bio: 'Passionate about sustainable living and reducing my environmental impact.'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setIsEditing(false);
  };

  const achievements = [
    { title: '7-Day Streak', icon: '🔥', description: 'Logged emissions for 7 consecutive days' },
    { title: 'Carbon Saver', icon: '🌱', description: 'Reduced weekly emissions by 15%' },
    { title: 'Eco Explorer', icon: '🌍', description: 'Tried 5 different eco suggestions' },
    { title: 'Goal Crusher', icon: '🎯', description: 'Met weekly goal 3 times in a row' }
  ];

  const stats = [
    { label: 'Days Active', value: '42', trend: '+12%' },
    { label: 'Total Saved', value: '156.7 kg', trend: '+8.3%' },
    { label: 'Weekly Average', value: '128.4 kg', trend: '-15.2%' },
    { label: 'Best Week', value: '98.2 kg', trend: 'Personal Best!' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
            Your Profile
          </h1>
          <p className="text-gray-600">
            Manage your account settings and track your environmental journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Profile Card - Mobile: Full width, Desktop: Left side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <button className="absolute bottom-2 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-gray-100 hover:border-green-500 transition-colors">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    Joined {new Date(user?.joinedDate || '').toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Weekly Goal</span>
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-800">{user?.weeklyGoal} kg CO₂</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Eco Score</span>
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-orange-600">B+</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Achievements</span>
                    <div className="flex items-center space-x-1">
                      <Leaf className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-600">{achievements.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content - Mobile: Full width below, Desktop: Right 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Personal Information
                </h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl transition-all ${
                          isEditing 
                            ? 'focus:ring-2 focus:ring-green-500 focus:border-transparent' 
                            : 'bg-gray-50 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl transition-all ${
                          isEditing 
                            ? 'focus:ring-2 focus:ring-green-500 focus:border-transparent' 
                            : 'bg-gray-50 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weekly CO₂ Goal (kg)
                  </label>
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={formData.weeklyGoal}
                      onChange={(e) => setFormData({ ...formData, weeklyGoal: Number(e.target.value) })}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl transition-all ${
                        isEditing 
                          ? 'focus:ring-2 focus:ring-green-500 focus:border-transparent' 
                          : 'bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-xl transition-all ${
                      isEditing 
                        ? 'focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none' 
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>

                {isEditing && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </motion.button>
                )}
              </form>
            </motion.div>

            {/* Statistics Grid - Mobile: 2x2, Desktop: 4x1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {stats.map((stat, index) => (
                <div key={stat.label} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-4">
                  <div className="text-center">
                    <p className="text-2xl lg:text-xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-xs lg:text-sm text-gray-600 mt-1">{stat.label}</p>
                    <div className="flex items-center justify-center space-x-1 mt-2">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">{stat.trend}</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Your Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="p-4 border border-gray-100 rounded-xl hover:border-green-200 hover:bg-green-50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{achievement.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;