/**
 * CO2 emission calculator for different transportation modes
 * Based on emission rates from the specification
 */

// CO2 emission rates in kg per km
export const CO2_EMISSION_RATES = {
  train: 0.02, // kg CO2 per km
  car: 0.2, // kg CO2 per km
  bus: 0.1, // kg CO2 per km
  airplane: 0.3, // kg CO2 per km
} as const

export type TransportMode = keyof typeof CO2_EMISSION_RATES

export interface CO2Emissions {
  train: number
  car: number
  bus: number
  airplane: number
  saved: number // Amount saved by using train instead of car
}

/**
 * Calculate CO2 emissions for a given distance and all transport modes
 * @param distanceKm Distance in kilometers
 * @returns CO2 emissions in kg for each transport mode
 */
export function calculateCO2Emissions(distanceKm: number): CO2Emissions {
  // Validate input
  if (distanceKm < 0) {
    throw new Error('Distance cannot be negative')
  }
  
  if (!isFinite(distanceKm)) {
    throw new Error('Distance must be a finite number')
  }
  
  // Calculate emissions for each mode
  const train = roundToTwo(distanceKm * CO2_EMISSION_RATES.train)
  const car = roundToTwo(distanceKm * CO2_EMISSION_RATES.car)
  const bus = roundToTwo(distanceKm * CO2_EMISSION_RATES.bus)
  const airplane = roundToTwo(distanceKm * CO2_EMISSION_RATES.airplane)
  
  // Calculate savings (difference between car and train)
  const saved = roundToTwo(car - train)
  
  return {
    train,
    car,
    bus,
    airplane,
    saved,
  }
}

/**
 * Calculate CO2 emissions for a specific transport mode
 * @param distanceKm Distance in kilometers
 * @param mode Transport mode
 * @returns CO2 emissions in kg
 */
export function calculateCO2ForMode(
  distanceKm: number,
  mode: TransportMode
): number {
  if (distanceKm < 0) {
    throw new Error('Distance cannot be negative')
  }
  
  return roundToTwo(distanceKm * CO2_EMISSION_RATES[mode])
}

/**
 * Calculate total CO2 emissions for multiple routes
 * @param routes Array of distances in kilometers
 * @returns Total CO2 emissions for each transport mode
 */
export function calculateTotalCO2(distances: number[]): CO2Emissions {
  const totalDistance = distances.reduce((sum, distance) => sum + distance, 0)
  return calculateCO2Emissions(totalDistance)
}

/**
 * Calculate CO2 savings percentage when using train vs other modes
 * @param distanceKm Distance in kilometers
 * @param compareMode Mode to compare against train
 * @returns Percentage saved (0-100)
 */
export function calculateSavingsPercentage(
  distanceKm: number,
  compareMode: Exclude<TransportMode, 'train'>
): number {
  const trainEmissions = calculateCO2ForMode(distanceKm, 'train')
  const otherEmissions = calculateCO2ForMode(distanceKm, compareMode)
  
  if (otherEmissions === 0) return 0
  
  const percentage = ((otherEmissions - trainEmissions) / otherEmissions) * 100
  return roundToTwo(percentage)
}

/**
 * Format CO2 value for display
 * @param co2Kg CO2 in kilograms
 * @returns Formatted string with unit
 */
export function formatCO2(co2Kg: number): string {
  if (co2Kg < 0.01) {
    return '< 0.01 kg'
  }
  
  if (co2Kg < 1) {
    return `${Math.round(co2Kg * 1000)} g`
  }
  
  if (co2Kg < 1000) {
    return `${co2Kg.toFixed(2)} kg`
  }
  
  return `${(co2Kg / 1000).toFixed(2)} t`
}

/**
 * Get emission level category based on CO2 amount
 * @param co2Kg CO2 in kilograms
 * @returns Emission level category
 */
export function getEmissionLevel(co2Kg: number): 'low' | 'medium' | 'high' | 'very-high' {
  if (co2Kg < 10) return 'low'
  if (co2Kg < 50) return 'medium'
  if (co2Kg < 100) return 'high'
  return 'very-high'
}

/**
 * Get emission color for visualization
 * @param mode Transport mode
 * @returns Hex color code
 */
export function getEmissionColor(mode: TransportMode): string {
  const colors = {
    train: '#10B981', // Green
    bus: '#F59E0B', // Amber
    car: '#EF4444', // Red
    airplane: '#991B1B', // Dark Red
  }
  return colors[mode]
}

/**
 * Calculate equivalent trees needed to offset CO2 emissions
 * Based on average tree absorbing 22kg of CO2 per year
 * @param co2Kg CO2 in kilograms
 * @returns Number of trees needed for one year offset
 */
export function calculateTreesEquivalent(co2Kg: number): number {
  const CO2_PER_TREE_PER_YEAR = 22 // kg
  return Math.ceil(co2Kg / CO2_PER_TREE_PER_YEAR)
}

/**
 * Helper function to round to two decimal places
 */
function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100
}