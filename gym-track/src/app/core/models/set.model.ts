export interface WorkoutSet {
  id: string;
  workout_exercise_id: string;
  set_number: number;
  reps: number | null;
  weight: number | null;
  notes: string | null;
  created_at: string;
}