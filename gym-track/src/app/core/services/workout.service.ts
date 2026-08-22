import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { WorkoutForm } from '../../features/workouts/models/workout-form.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

  constructor(
    private supabaseService: SupabaseService
  ) {}

  async createWorkout(
    workout: WorkoutForm
  ): Promise<string> {

    const supabase = this.supabaseService.client;

    // --------------------------------------------------
    // 1. Create workout
    // --------------------------------------------------

    const { data: workoutData, error: workoutError } =
      await supabase
        .from('workouts')
        .insert({
          workout_date: workout.workoutDate,
          name: workout.name,
          notes: workout.notes
        })
        .select()
        .single();

    if (workoutError) {
      throw workoutError;
    }

    const workoutId = workoutData.id;

    // --------------------------------------------------
    // 2. Create exercises + sets
    // --------------------------------------------------

    for (
      let exerciseIndex = 0;
      exerciseIndex < workout.exercises.length;
      exerciseIndex++
    ) {

      const workoutExercise =
        workout.exercises[exerciseIndex];

      // ----------------------------------------------
      // Create workout_exercise
      // ----------------------------------------------

      const {
        data: workoutExerciseData,
        error: workoutExerciseError
      } = await supabase
        .from('workout_exercises')
        .insert({
          workout_id: workoutId,
          exercise_id: workoutExercise.exerciseId,
          exercise_order: exerciseIndex,
          notes: workoutExercise.notes
        })
        .select()
        .single();

      if (workoutExerciseError) {
        throw workoutExerciseError;
      }

      const workoutExerciseId =
        workoutExerciseData.id;

      // ----------------------------------------------
      // Create sets
      // ----------------------------------------------

      const sets = workoutExercise.sets.map(set => ({
        workout_exercise_id: workoutExerciseId,
        set_number: set.setNumber,
        reps: set.reps,
        weight: set.weight,
        notes: set.notes
      }));

      if (sets.length > 0) {

        const { error: setsError } =
          await supabase
            .from('sets')
            .insert(sets);

        if (setsError) {
          throw setsError;
        }
      }
    }

    return workoutId;
  }
}