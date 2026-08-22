export interface ExerciseChartPoint {
  date: string;
  value: number;
}

export interface ExerciseChartData {
  maxWeight: ExerciseChartPoint[];
  volume: ExerciseChartPoint[];
}