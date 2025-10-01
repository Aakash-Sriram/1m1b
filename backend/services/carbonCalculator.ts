export interface CarbonActivity {
  activity_type: string;
  activity_value: number;
  unit: string;
}

export interface CarbonResult {
  calculated_co2: number;
  category: string;
}

// Carbon emission factors (kg CO2 per unit)
const EMISSION_FACTORS = {
  // Transport
  car_km: 0.21,        // kg CO2 per km
  bus_km: 0.105,       // kg CO2 per km
  train_km: 0.041,     // kg CO2 per km
  flight_km: 0.255,    // kg CO2 per km
  
  // Energy
  electricity_kwh: 0.85, // kg CO2 per kWh
  gas_hour: 2.0,       // kg CO2 per hour cooking
  heating_hour: 1.5,   // kg CO2 per hour
  
  // Food
  beef_kg: 27.0,       // kg CO2 per kg
  chicken_kg: 6.9,     // kg CO2 per kg
  vegetables_kg: 2.0,  // kg CO2 per kg
  dairy_kg: 3.2,       // kg CO2 per kg
  
  // Waste
  plastic_kg: 6.0,     // kg CO2 per kg
  paper_kg: 1.5,       // kg CO2 per kg
  food_waste_kg: 2.5   // kg CO2 per kg
};

export class CarbonCalculator {
  static calculateCO2(activity: CarbonActivity): CarbonResult {
    const { activity_type, activity_value, unit } = activity;
    
    let calculated_co2 = 0;
    let category = 'other';

    // Transport calculations
    if (activity_type.includes('car') && unit === 'km') {
      calculated_co2 = activity_value * EMISSION_FACTORS.car_km;
      category = 'transport';
    }
    else if (activity_type.includes('bus') && unit === 'km') {
      calculated_co2 = activity_value * EMISSION_FACTORS.bus_km;
      category = 'transport';
    }
    else if (activity_type.includes('train') && unit === 'km') {
      calculated_co2 = activity_value * EMISSION_FACTORS.train_km;
      category = 'transport';
    }
    else if (activity_type.includes('flight') && unit === 'km') {
      calculated_co2 = activity_value * EMISSION_FACTORS.flight_km;
      category = 'transport';
    }
    
    // Energy calculations
    else if (activity_type.includes('electricity') && unit === 'kwh') {
      calculated_co2 = activity_value * EMISSION_FACTORS.electricity_kwh;
      category = 'energy';
    }
    else if (activity_type.includes('gas') && unit === 'hour') {
      calculated_co2 = activity_value * EMISSION_FACTORS.gas_hour;
      category = 'energy';
    }
    else if (activity_type.includes('heating') && unit === 'hour') {
      calculated_co2 = activity_value * EMISSION_FACTORS.heating_hour;
      category = 'energy';
    }
    
    // Food calculations
    else if (activity_type.includes('beef') && unit === 'kg') {
      calculated_co2 = activity_value * EMISSION_FACTORS.beef_kg;
      category = 'food';
    }
    else if (activity_type.includes('chicken') && unit === 'kg') {
      calculated_co2 = activity_value * EMISSION_FACTORS.chicken_kg;
      category = 'food';
    }
    else if (activity_type.includes('vegetables') && unit === 'kg') {
      calculated_co2 = activity_value * EMISSION_FACTORS.vegetables_kg;
      category = 'food';
    }
    else if (activity_type.includes('dairy') && unit === 'kg') {
      calculated_co2 = activity_value * EMISSION_FACTORS.dairy_kg;
      category = 'food';
    }
    
    // Waste calculations
    else if (activity_type.includes('plastic') && unit === 'kg') {
      calculated_co2 = activity_value * EMISSION_FACTORS.plastic_kg;
      category = 'waste';
    }
    else if (activity_type.includes('paper') && unit === 'kg') {
      calculated_co2 = activity_value * EMISSION_FACTORS.paper_kg;
      category = 'waste';
    }
    else if (activity_type.includes('food_waste') && unit === 'kg') {
      calculated_co2 = activity_value * EMISSION_FACTORS.food_waste_kg;
      category = 'waste';
    }

    return {
      calculated_co2: parseFloat(calculated_co2.toFixed(2)),
      category
    };
  }
}