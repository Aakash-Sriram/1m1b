export class AIModelService {
  
  // Generate personalized eco-suggestions without OpenAI
  static async generateEcoSuggestions(userData: any): Promise<string[]> {
    const { breakdown, total_co2 } = userData;
    const suggestions: string[] = [];

    // Transport suggestions
    if (breakdown.transport > total_co2 * 0.4) {
      suggestions.push(
        "🚗 Consider carpooling or using public transport 2-3 times per week",
        "🚶 Walk or cycle for trips under 3km to reduce emissions",
        "🛒 Combine multiple errands into one trip to minimize driving"
      );
    }

    // Energy suggestions
    if (breakdown.energy > total_co2 * 0.3) {
      suggestions.push(
        "💡 Switch to LED bulbs in high-usage areas of your home",
        "🔌 Unplug electronics when not in use to avoid phantom energy drain",
        "🌞 Use natural light during daytime instead of artificial lighting"
      );
    }

    // Food suggestions
    if (breakdown.food > total_co2 * 0.25) {
      suggestions.push(
        "🌱 Try meatless Mondays - replace one meat meal with plant-based options",
        "🥦 Buy local and seasonal produce to reduce transportation emissions",
        "📝 Plan meals ahead to reduce food waste and save money"
      );
    }

    // Waste suggestions
    if (breakdown.waste > total_co2 * 0.15) {
      suggestions.push(
        "♻️ Start composting food scraps to reduce landfill emissions",
        "📦 Reduce single-use plastics by using reusable containers",
        "📚 Recycle paper and cardboard properly to save trees"
      );
    }

    // General suggestions
    suggestions.push(
      "💧 Fix leaky faucets to save water and energy",
      "🌳 Plant a tree or support reforestation projects",
      "📊 Track your progress weekly to stay motivated"
    );

    return suggestions.slice(0, 5); // Return top 5 suggestions
  }

  // Generate detailed insights without OpenAI
  static async generateDetailedInsights(userData: any): Promise<any> {
    const { breakdown, total_co2, weekly_trend } = userData;
    
    let analysis = "";
    let comparison = "average";
    let improvement_potential = 0;

    // Generate analysis based on data
    if (total_co2 > 120) {
      analysis = `Your carbon footprint of ${total_co2}kg is above the recommended weekly average (100kg). Focus on reducing emissions in your highest impact categories.`;
      comparison = "above_average";
      improvement_potential = total_co2 - 80;
    } else if (total_co2 < 60) {
      analysis = `Great job! Your carbon footprint of ${total_co2}kg is well below average. Keep up the eco-friendly habits!`;
      comparison = "below_average";
      improvement_potential = 0;
    } else {
      analysis = `Your carbon footprint of ${total_co2}kg is within a good range. Small improvements can make a big difference over time.`;
      comparison = "average";
      improvement_potential = total_co2 - 60;
    }

    // Add category-specific insights
    if (breakdown.transport > total_co2 * 0.4) {
      analysis += " Transportation is your largest emissions source. Consider alternative travel methods.";
    }
    if (breakdown.energy > total_co2 * 0.3) {
      analysis += " Energy usage is significant. Look into energy-efficient appliances and habits.";
    }

    return {
      detailed_analysis: analysis,
      comparison: comparison,
      improvement_potential: Math.max(0, improvement_potential)
    };
  }
}