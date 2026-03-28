export type Region = 'Sahel' | 'Centre' | 'Hauts-Bassins';
export type SimulationSpeed = 'normal' | 'fast';

export type GrowthStage = 'seed' | 'growing' | 'healthy' | 'mature' | 'dry' | 'dead';
export type YieldCategory = 'Low' | 'Medium' | 'High';

export interface SimulationControls {
  rainfallIntensity: number;
  rainfallVariability: number;
  seasonLength: number;
  speed: SimulationSpeed;
  soilQuality: number;
  region: Region;
}

export interface ImportedDailyData {
  date: string;
  rainfall: number;
  temperature?: number;
  soil?: number;
  yield?: number;
}

export interface DailySimulation {
  day: number;
  rainfall: number;
  temperature: number;
  soilQuality: number;
  cropHealth: number;
  growthProgress: number;
  stage: GrowthStage;
  statusMessage: string;
  predictedYield: number;
  yieldCategory: YieldCategory;
}

interface RegionProfile {
  baseDailyRain: number;
  temperatureBase: number;
  soilModifier: number;
}

const REGION_PROFILE: Record<Region, RegionProfile> = {
  Sahel: { baseDailyRain: 4.8, temperatureBase: 33, soilModifier: 0.9 },
  Centre: { baseDailyRain: 6.1, temperatureBase: 31, soilModifier: 1.0 },
  'Hauts-Bassins': { baseDailyRain: 7.3, temperatureBase: 29, soilModifier: 1.1 },
};

const DEFAULT_TRAINING = [
  { rainfall: 180, yield: 0.6 },
  { rainfall: 280, yield: 0.95 },
  { rainfall: 380, yield: 1.35 },
  { rainfall: 500, yield: 1.95 },
  { rainfall: 620, yield: 2.35 },
  { rainfall: 760, yield: 2.75 },
  { rainfall: 880, yield: 3.0 },
];

export class LinearRegression {
  private slope = 0;
  private intercept = 0;
  private trained = false;

  fit(data: Array<{ rainfall: number; yield: number }>) {
    const n = data.length;
    if (n < 2) {
      throw new Error('At least two rows are required to train the model.');
    }

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (const row of data) {
      sumX += row.rainfall;
      sumY += row.yield;
      sumXY += row.rainfall * row.yield;
      sumXX += row.rainfall * row.rainfall;
    }

    this.slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    this.intercept = (sumY - this.slope * sumX) / n;
    this.trained = true;
  }

  predict(rainfall: number) {
    if (!this.trained) {
      this.fit(DEFAULT_TRAINING);
    }
    return Math.max(0, this.slope * rainfall + this.intercept);
  }
}

const model = new LinearRegression();
model.fit(DEFAULT_TRAINING);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function categorizeYield(value: number): YieldCategory {
  if (value < 1.2) return 'Low';
  if (value < 2.2) return 'Medium';
  return 'High';
}

function stageFromState(progress: number, health: number): GrowthStage {
  if (health <= 10) return 'dead';
  if (health <= 28) return 'dry';
  if (progress < 20) return 'seed';
  if (progress < 45) return 'growing';
  if (progress < 78) return 'healthy';
  return 'mature';
}

function statusFromState(health: number, rainfall: number, dryStreak: number, stage: GrowthStage): string {
  if (stage === 'mature' && health > 70) return 'Good harvest expected';
  if (dryStreak >= 5 || rainfall < 1.5) return 'Drought risk';
  if (health < 50 || rainfall > 17) return 'Water stress';
  return 'Healthy growth';
}

function seasonalFactor(day: number, seasonLength: number) {
  const x = day / Math.max(1, seasonLength - 1);
  const peak = Math.exp(-Math.pow((x - 0.5) / 0.26, 2));
  return 0.35 + peak;
}

function generateRainfall(day: number, controls: SimulationControls): number {
  const region = REGION_PROFILE[controls.region];
  const intensityFactor = controls.rainfallIntensity / 50;
  const variabilityFactor = controls.rainfallVariability / 100;

  const base = region.baseDailyRain * intensityFactor * seasonalFactor(day, controls.seasonLength);
  const noise = (Math.random() - 0.5) * variabilityFactor * region.baseDailyRain * 2.5;

  const dryShockChance = 0.04 + variabilityFactor * 0.16;
  const stormChance = 0.03 + variabilityFactor * 0.2;

  let rainfall = base + noise;

  if (Math.random() < dryShockChance) {
    rainfall *= 0.1;
  }

  if (Math.random() < stormChance) {
    rainfall += 8 + variabilityFactor * 12;
  }

  return clamp(Number(rainfall.toFixed(2)), 0, 35);
}

function generateTemperature(day: number, controls: SimulationControls, rainfall: number): number {
  const profile = REGION_PROFILE[controls.region];
  const variability = controls.rainfallVariability / 100;
  const seasonal = Math.sin((day / controls.seasonLength) * Math.PI * 2);
  const rainCooling = rainfall > 8 ? 1.8 : 0;
  const noise = (Math.random() - 0.5) * (1 + variability * 3);
  return Number((profile.temperatureBase + seasonal * 3 + noise - rainCooling).toFixed(1));
}

export function trainModelWithImportedData(data: ImportedDailyData[]) {
  const rows = data.filter((row): row is ImportedDailyData & { yield: number } => {
    return typeof row.yield === 'number' && row.yield > 0;
  });

  if (rows.length < 6) {
    return false;
  }

  const seasonRain = rows.reduce((sum, row) => sum + row.rainfall, 0);
  const meanYield = rows.reduce((sum, row) => sum + row.yield, 0) / rows.length;

  const syntheticSet = [
    { rainfall: seasonRain * 0.7, yield: meanYield * 0.75 },
    { rainfall: seasonRain * 0.85, yield: meanYield * 0.9 },
    { rainfall: seasonRain, yield: meanYield },
    { rainfall: seasonRain * 1.1, yield: meanYield * 1.1 },
    { rainfall: seasonRain * 1.2, yield: meanYield * 1.18 },
    { rainfall: seasonRain * 1.3, yield: meanYield * 1.22 },
  ];

  model.fit(syntheticSet);
  return true;
}

function projectYield(
  cumulativeRain: number,
  day: number,
  seasonLength: number,
  health: number,
  soilQuality: number
) {
  const elapsed = Math.max(1, day + 1);
  const projectedSeasonRain = (cumulativeRain / elapsed) * seasonLength;
  const baseline = model.predict(projectedSeasonRain);
  const healthFactor = 0.55 + health / 180;
  const soilFactor = 0.75 + soilQuality / 400;
  const predicted = clamp(Number((baseline * healthFactor * soilFactor).toFixed(2)), 0, 4.5);

  return {
    predicted,
    category: categorizeYield(predicted),
  };
}

export function runSeasonSimulation(
  controls: SimulationControls,
  importedData?: ImportedDailyData[]
): DailySimulation[] {
  const simulation: DailySimulation[] = [];

  let health = 58;
  let progress = 0;
  let dryStreak = 0;
  let cumulativeRain = 0;

  for (let index = 0; index < controls.seasonLength; index += 1) {
    const importedRow = importedData?.[index];
    const daySoil = clamp(importedRow?.soil ?? controls.soilQuality, 10, 100);
    const rainfall = importedRow ? clamp(importedRow.rainfall, 0, 40) : generateRainfall(index, controls);
    const temperature = importedRow?.temperature ?? generateTemperature(index, controls, rainfall);

    cumulativeRain += rainfall;

    if (rainfall < 1.5) {
      dryStreak += 1;
    } else {
      dryStreak = 0;
    }

    const optimalMin = 4;
    const optimalMax = 10;

    let healthDelta = 0;
    if (rainfall < 1.5) {
      healthDelta = -2.8 - dryStreak * 0.35;
    } else if (rainfall < optimalMin) {
      healthDelta = -1.2;
    } else if (rainfall <= optimalMax) {
      healthDelta = 2.4;
    } else if (rainfall <= 17) {
      healthDelta = -0.7;
    } else {
      healthDelta = -2.1;
    }

    const heatPenalty = temperature > 35 ? (temperature - 35) * 0.35 : 0;
    const soilBonus = ((daySoil - 50) / 50) * REGION_PROFILE[controls.region].soilModifier;

    health = clamp(Number((health + healthDelta + soilBonus - heatPenalty).toFixed(2)), 0, 100);

    const waterSuitability = rainfall >= optimalMin && rainfall <= optimalMax ? 1 : rainfall < optimalMin ? 0.2 : 0.45;
    const stressPenalty = health < 45 ? 0.6 : 0;
    const growthDelta = Math.max(0, 0.45 + health / 100 + waterSuitability * 0.65 - stressPenalty);

    progress = clamp(Number((progress + growthDelta).toFixed(2)), 0, 100);

    const stage = stageFromState(progress, health);
    const statusMessage = statusFromState(health, rainfall, dryStreak, stage);
    const yieldInfo = projectYield(cumulativeRain, index, controls.seasonLength, health, daySoil);

    simulation.push({
      day: index + 1,
      rainfall,
      temperature,
      soilQuality: daySoil,
      cropHealth: health,
      growthProgress: progress,
      stage,
      statusMessage,
      predictedYield: yieldInfo.predicted,
      yieldCategory: yieldInfo.category,
    });
  }

  return simulation;
}

export function getScenarioPreset(name: 'good' | 'bad' | 'unpredictable'): Partial<SimulationControls> {
  if (name === 'good') {
    return {
      rainfallIntensity: 58,
      rainfallVariability: 22,
      soilQuality: 72,
      speed: 'normal',
    };
  }

  if (name === 'bad') {
    return {
      rainfallIntensity: 28,
      rainfallVariability: 68,
      soilQuality: 46,
      speed: 'normal',
    };
  }

  return {
    rainfallIntensity: 52,
    rainfallVariability: 86,
    soilQuality: 58,
    speed: 'fast',
  };
}

export function stageVisual(stage: GrowthStage) {
  switch (stage) {
    case 'seed':
      return { icon: 'seed', color: '#7C3F00' };
    case 'growing':
      return { icon: 'sprout', color: '#59A84F' };
    case 'healthy':
      return { icon: 'plant', color: '#2F9E44' };
    case 'mature':
      return { icon: 'grain', color: '#D4A017' };
    case 'dry':
      return { icon: 'dry', color: '#B88A44' };
    default:
      return { icon: 'dead', color: '#8A6F53' };
  }
}
