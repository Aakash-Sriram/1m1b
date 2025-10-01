import { query } from '../db';
import { AIModelService } from './aiModel';
import { PredictionModel } from './predictionModel';

export class AIAnalysisService {
  static async analyzeUserData(clerkUserId: string): Promise<any> {
    const carbonData = await query(
      `SELECT category, SUM(calculated_co2) as total_co2 
       FROM carbon_entries 
       WHERE clerk_user_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '7 days'
       GROUP BY category`,
      [clerkUserId]
    );

    const breakdown = this.calculateBreakdown(carbonData.rows);
    const basicInsights = this.generateBasicInsights(carbonData.rows);

    // Get AI-powered suggestions and insights
    const [aiSuggestions, detailedInsights, predictions] = await Promise.all([
      AIModelService.generateEcoSuggestions({
        ...basicInsights,
        breakdown,
        total_co2: breakdown.total
      }),
      AIModelService.generateDetailedInsights({
        ...basicInsights,
        breakdown,
        total_co2: breakdown.total
      }),
      PredictionModel.predictFutureEmissions(clerkUserId)
    ]);

    return {
      total_co2: breakdown.total,
      breakdown: breakdown.categories,
      insights: {
        ...basicInsights,
        ai_suggestions: aiSuggestions,
        detailed_analysis: detailedInsights.detailed_analysis,
        comparison: detailedInsights.comparison,
        improvement_potential: detailedInsights.improvement_potential
      },
      predictions,
      generated_at: new Date().toISOString()
    };
  }

  private static generateBasicInsights(carbonData: any[]): any {
    const highImpactAreas: string[] = [];
    const quickWins: string[] = [];
    
    let totalCO2 = 0;
    const categoryTotals: { [key: string]: number } = {};

    carbonData.forEach(row => {
      totalCO2 += parseFloat(row.total_co2);
      categoryTotals[row.category] = parseFloat(row.total_co2);
    });

    if (categoryTotals['transport'] > totalCO2 * 0.4) {
      highImpactAreas.push('Transportation');
      quickWins.push('Use public transport for commute');
    }

    if (categoryTotals['food'] > totalCO2 * 0.3) {
      highImpactAreas.push('Food consumption');
      quickWins.push('Try meatless Mondays');
    }

    if (categoryTotals['energy'] > totalCO2 * 0.25) {
      highImpactAreas.push('Home energy usage');
      quickWins.push('Switch to LED bulbs');
    }

    const weeklyTrend = totalCO2 > 100 ? 'increasing' : totalCO2 < 50 ? 'decreasing' : 'stable';

    return {
      high_impact_areas: highImpactAreas,
      quick_wins: quickWins,
      weekly_trend: weeklyTrend
    };
  }

  private static calculateBreakdown(carbonData: any[]): any {
    const categories: { [key: string]: number } = {};
    let total = 0;

    carbonData.forEach(row => {
      categories[row.category] = parseFloat(row.total_co2);
      total += parseFloat(row.total_co2);
    });

    return {
      total: parseFloat(total.toFixed(2)),
      categories
    };
  }
}