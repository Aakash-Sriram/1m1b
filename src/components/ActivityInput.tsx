import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Car, Home, Utensils, Trash2 } from 'lucide-react';
import { useCarbonEntries } from '../hooks/useCarbonEntries';

const activityTypes = [
  { value: 'car_drive', label: 'Car Drive', icon: Car, unit: 'km' },
  { value: 'bus_ride', label: 'Bus Ride', icon: Car, unit: 'km' },
  { value: 'electricity_usage', label: 'Electricity', icon: Home, unit: 'kwh' },
  { value: 'gas_cooking', label: 'Gas Cooking', icon: Home, unit: 'hour' },
  { value: 'beef_consumption', label: 'Beef', icon: Utensils, unit: 'kg' },
  { value: 'vegetable_consumption', label: 'Vegetables', icon: Utensils, unit: 'kg' },
  { value: 'plastic_waste', label: 'Plastic Waste', icon: Trash2, unit: 'kg' },
  { value: 'food_waste', label: 'Food Waste', icon: Trash2, unit: 'kg' }
];

export const ActivityInput: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(activityTypes[0]);
  const [value, setValue] = useState('');
  const { addCarbonEntry, loading } = useCarbonEntries();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!value || parseFloat(value) <= 0) return;

    try {
      await addCarbonEntry({
        activity_type: selectedActivity.value,
        activity_value: parseFloat(value),
        unit: selectedActivity.unit
      });
      
      setValue('');
      setIsOpen(false);
      // You might want to refresh the dashboard data here
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center text-white"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-6 w-80"
        >
          <h3 className="text-lg font-semibold mb-4">Add Activity</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Type
              </label>
              <select
                value={selectedActivity.value}
                onChange={(e) => {
                  const activity = activityTypes.find(a => a.value === e.target.value);
                  if (activity) setSelectedActivity(activity);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {activityTypes.map(activity => (
                  <option key={activity.value} value={activity.value}>
                    {activity.label} ({activity.unit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                step="0.1"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`Enter ${selectedActivity.unit}`}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !value}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};