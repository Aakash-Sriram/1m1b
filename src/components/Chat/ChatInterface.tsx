import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader, Bot, User } from 'lucide-react';
import { ChatMessage } from '../../types';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi Asha! I'm your eco-assistant. I can help you track your carbon footprint, suggest sustainable alternatives, and answer questions about environmental impact. How can I help you today?",
      isUser: false,
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Add this function to your ChatInterface component
  const handleActivityInput = async (activity: string) => {
    // Parse activity from chat message
    // Example: "I drove 5km today" -> {activity_type: 'car_drive', value: 5, unit: 'km'}
    
    const activities = [
      { pattern: /(\d+)\s*km.*car|drove.*(\d+)\s*km/, type: 'car_drive', unit: 'km' },
      { pattern: /(\d+)\s*km.*bus|bus.*(\d+)\s*km/, type: 'bus_ride', unit: 'km' },
      { pattern: /(\d+)\s*kwh.*electric|electric.*(\d+)\s*kwh/, type: 'electricity_usage', unit: 'kwh' },
      { pattern: /(\d+)\s*hour.*gas|cook.*(\d+)\s*hour/, type: 'gas_cooking', unit: 'hour' },
      { pattern: /(\d+\.?\d*)\s*kg.*beef|beef.*(\d+\.?\d*)\s*kg/, type: 'beef_consumption', unit: 'kg' },
      { pattern: /(\d+)\s*km.*walk|walked.*(\d+)\s*km/, type: 'walking', unit: 'km' },
      { pattern: /(\d+)\s*km.*cycle|cycled.*(\d+)\s*km/, type: 'cycling', unit: 'km' },
    ];

    for (const activityRule of activities) {
      const match = activity.match(activityRule.pattern);
      if (match) {
        const value = parseFloat(match[1] || match[2]);
        if (value) {
          try {
            await fetch('/api/carbon-entries', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                activity_type: activityRule.type,
                activity_value: value,
                unit: activityRule.unit
              })
            });
            return true; // Activity saved
          } catch (error) {
            console.error('Failed to save activity:', error);
          }
        }
      }
    }
    return false; // No activity detected
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Try to save activity from user message
    const activitySaved = await handleActivityInput(inputValue);

    // Simulate AI response (update this to be more contextual)
    setTimeout(() => {
      let response = "";
      
      if (activitySaved) {
        response = "Great! I've logged your activity and updated your carbon footprint. Check your dashboard to see the impact! 📊";
      } else {
        // Your existing responses
        const responses = [
          "That's a great question! Based on your recent activity, I can see you've been doing well with reducing transport emissions. Have you considered carpooling or using public transport for longer trips?",
          "I can help you calculate the carbon footprint of different activities. For example, a 10km car trip typically generates about 2.3kg of CO₂. Would you like me to suggest some eco-friendly alternatives?",
          "Your weekly goal is 150kg CO₂, and you're currently at a good pace! Remember that small changes like switching to LED bulbs or eating one plant-based meal per day can make a significant impact.",
          "Great initiative! Here are some personalized tips based on your patterns: Try cycling for trips under 5km, use a reusable water bottle, and consider composting your food waste.",
          "I notice your energy consumption has been higher lately. Simple changes like unplugging electronics when not in use and using natural light during the day can reduce your footprint by 10-15%.",
          "Based on your carbon footprint data, I'd suggest focusing on your highest impact areas first. Small consistent changes can lead to big reductions over time!",
          "Would you like me to analyze your recent activities and provide personalized suggestions for reducing your environmental impact?"
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      }
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-t-2xl shadow-md p-6 border-b border-gray-100"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Eco Assistant</h2>
              <p className="text-sm text-gray-600">Your sustainable living companion</p>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 bg-white overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                  message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isUser 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                      : 'bg-gradient-to-r from-green-500 to-green-600'
                  }`}>
                    {message.isUser ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-blue-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white rounded-b-2xl shadow-md p-6 border-t border-gray-100">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about reducing your carbon footprint..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                disabled={isLoading}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send • The assistant provides suggestions based on your activity patterns
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;