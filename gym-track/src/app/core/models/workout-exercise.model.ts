export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  exercise_order: number;
  notes: string | null;
  created_at: string;
}