import { WorkoutSet } from './set.model';

export interface ExerciseHistory {
  workoutId: string;
  workoutDate: string;
  workoutName: string | null;
  sets: WorkoutSet[];
}