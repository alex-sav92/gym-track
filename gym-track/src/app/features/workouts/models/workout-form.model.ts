import { WorkoutExerciseForm } from "./workout-exercise-form.model";

export interface WorkoutForm {
   workoutDate: string;
  name: string;
  notes: string;
  exercises: WorkoutExerciseForm[];
}