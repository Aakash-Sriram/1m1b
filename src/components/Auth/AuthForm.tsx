import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, signup, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await login(email, password);
    } else {
      await signup(email, password, name);
    }
  };

  const floatingIcons = [
    { icon: Leaf, delay: 0, x: '10%', y: '20%' },
    { icon: Leaf, delay: 1, x: '80%', y: '10%' },
    { icon: Leaf, delay: 2, x: '15%', y: '70%' },
    { icon: Leaf, delay: 0.5, x: '85%', y: '60%' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Desktop Split Screen - Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-400 via-green-500 to-green-600 relative overflow-hidden">
        <div className="flex flex-col justify-center items-center w-full text-white p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Leaf className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Track Your Impact</h1>
            <p className="text-xl opacity-90 max-w-md">
              Join the eco-conscious community and make every day count towards a sustainable future.
            </p>
          </motion.div>
        </div>

        {/* Floating Icons */}
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ delay: item.delay, duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute"
            style={{ left: item.x, top: item.y }}
          >
            <item.icon className="w-8 h-8 text-white" />
          </motion.div>
        ))}
      </div>

      {/* Mobile/Desktop Form Side */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-400 via-green-500 to-green-600 lg:bg-gray-50 relative">
        {/* Mobile Background Icons */}
        <div className="lg:hidden absolute inset-0 overflow-hidden">
          {floatingIcons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{ delay: item.delay, duration: 2, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute"
              style={{ left: item.x, top: item.y }}
            >
              <item.icon className="w-6 h-6 text-white" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md p-8 relative z-10"
        >
          <div className="bg-white rounded-2xl shadow-2xl lg:shadow-xl p-8">
            {/* Logo for mobile */}
            <div className="lg:hidden flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800">EcoTracker</span>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                {isLogin ? 'Welcome Back' : 'Join EcoTracker'}
              </h2>
              <p className="text-gray-600">
                {isLogin ? 'Continue your sustainable journey' : 'Start your eco-conscious adventure'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center space-x-2 hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthForm;