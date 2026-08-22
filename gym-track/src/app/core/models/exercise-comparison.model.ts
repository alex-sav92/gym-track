export interface ExerciseComparison {
  previousVolume: number;
  currentVolume: number;
  volumeDifference: number;
  volumePercentage: number;

  previousMaxWeight: number | null;
  currentMaxWeight: number | null;
  maxWeightDifference: number | null;
  maxWeightPercentage: number | null;

  previousMaxReps: number | null;
  currentMaxReps: number | null;
  maxRepsDifference: number | null;

  estimatedPrevious1RM: number | null;
  estimatedCurrent1RM: number | null;
  estimated1RMDifference: number | null;
  estimated1RMPercentage: number | null;

  status: 'improved' | 'declined' | 'similar' | 'no-history';
}