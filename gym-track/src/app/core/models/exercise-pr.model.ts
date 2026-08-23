export type ExercisePrType =
  | 'weight'
  | 'reps'
  | 'volume'
  | 'estimated-1rm';

export interface ExercisePR {
  type: ExercisePrType;
  previousValue: number | null;
  currentValue: number;
  difference: number | null;
  percentage: number | null;
  message: string;
}