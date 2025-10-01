import { query } from '../db';

export interface PredictionResult {
  date: string;
  predicted_co2: number;
  confidence: number;
  factors: string[];
}

export class PredictionModel {
  
  static async predictFutureEmissions(clerkUserId: string): Promise<PredictionResult[]> {
    const historicalData = await this.getHistoricalData(clerkUserId);
    return this.calculatePredictions(historicalData);
  }

  private static async getHistoricalData(clerkUserId: string): Promise<any[]> {
    const result = await query(
      `SELECT DATE(created_at) as date, SUM(calculated_co2) as daily_co2
       FROM carbon_entries 
       WHERE clerk_user_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY DATE(created_at)
       ORDER BY date`,
      [clerkUserId]
    );
    return result.rows;
  }

  private static calculatePredictions(historicalData: any[]): PredictionResult[] {
    const predictions: PredictionResult[] = [];
    
    if (historicalData.length === 0) {
      return this.getDefaultPredictions();
    }

    const dailyValues = historicalData.map(d => parseFloat(d.daily_co2));
    const average = dailyValues.reduce((a, b) => a + b, 0) / dailyValues.length;
    
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const predictionDate = new Date(today);
      predictionDate.setDate(today.getDate() + i);

      const dayOfWeek = predictionDate.getDay();
      const dayFactor = this.getDayOfWeekFactor(dayOfWeek);
      const randomVariation = 0.9 + (Math.random() * 0.2);
      
      const predicted_co2 = Math.max(5, average * dayFactor * randomVariation);
      const confidence = this.calculateConfidence(historicalData.length, dailyValues);
      const factors = this.identifyFactors(dayOfWeek, historicalData);

      predictions.push({
        date: predictionDate.toISOString().split('T')[0],
        predicted_co2: parseFloat(predicted_co2.toFixed(2)),
        confidence,
        factors
      });
    }

    return predictions;
  }

  private static getDayOfWeekFactor(dayOfWeek: number): number {
    const factors = [1.1, 1.0, 1.0, 1.0, 1.0, 1.2, 1.3];
    return factors[dayOfWeek];
  }

  private static calculateConfidence(dataPoints: number, values: number[]): number {
    let baseConfidence = Math.min(95, 50 + (dataPoints * 3));
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - average, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    if (stdDev > average * 0.5) {
      baseConfidence -= 15;
    }
    
    return Math.max(60, baseConfidence);
  }

  private static identifyFactors(dayOfWeek: number, historicalData: any[]): string[] {
    const factors: string[] = [];

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      factors.push('weekend_pattern');
    }

    if (historicalData.length < 7) {
      factors.push('limited_data');
    }

    return factors.slice(0, 3);
  }

  private static getDefaultPredictions(): PredictionResult[] {
    const predictions: PredictionResult[] = [];
    const today = new Date();

    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      predictions.push({
        date: date.toISOString().split('T')[0],
        predicted_co2: 25 + (Math.random() * 10),
        confidence: 65,
        factors: ['new_user_pattern']
      });
    }

    return predictions;
  }
}