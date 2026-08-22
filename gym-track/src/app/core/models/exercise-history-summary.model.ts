import { ExerciseHistory } from './exercise-history.model';

export interface ExerciseHistorySummary {
  exerciseId: number;

  exerciseName: string;

  sessions: ExerciseHistory[];

  bestWeight: number | null;

  bestReps: number | null;

  bestVolume: number;

  firstRecordedWeight: number | null;

  latestWeight: number | null;
}