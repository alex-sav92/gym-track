import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Exercise } from '../models/exercise.model';
import { environment } from '../../../environments/environment';
import { ExerciseHistory } from '../models/exercise-history.model';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  constructor(private supabaseService: SupabaseService) {}

  async getAll(): Promise<Exercise[]> {
     const { data, error } = await this.supabaseService.client
      .from('exercises')
      .select('*')
      .order('name');

      if (error) {
        console.error('Error loading exercises:', error);
        throw error;
      }

      return data ?? [];
  }
  async getLatestPerformance(
  exerciseId: number
): Promise<ExerciseHistory | null> {

  const { data, error } = await this.supabaseService.client
    .from('workout_exercises')
    .select(`
      id,
      workout_id,
      exercise_id,
      workout:workouts (
        id,
        workout_date,
        name
      ),
      sets (
        id,
        workout_exercise_id,
        set_number,
        reps,
        weight,
        notes,
        created_at
      )
    `)
    .eq('exercise_id', exerciseId);

  console.log('History query exerciseId:', exerciseId);
  console.log('History query data:', data);
  console.log('History query error:', error);

  if (error) {
    console.error('Error loading exercise history:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return null;
  }

  // Sort the returned workout records ourselves.
  // This avoids relying on PostgREST nested ordering.
  data.sort((a: any, b: any) => {

    const dateA = Array.isArray(a.workout)
      ? a.workout[0]?.workout_date
      : a.workout?.workout_date;

    const dateB = Array.isArray(b.workout)
      ? b.workout[0]?.workout_date
      : b.workout?.workout_date;

    return (
      new Date(dateB).getTime() -
      new Date(dateA).getTime()
    );
  });

  const latest = data[0];

  const workout = Array.isArray(latest.workout)
    ? latest.workout[0]
    : latest.workout;

  if (!workout) {
    console.log('No workout relationship found.');
    return null;
  }

  return {
    workoutId: workout.id,
    workoutDate: workout.workout_date,
    workoutName: workout.name,
    sets: latest.sets ?? []
  };
}
async getExerciseHistory(
  exerciseId: number
): Promise<ExerciseHistory[]> {

  const { data, error } =
    await this.supabaseService.client
      .from('workout_exercises')
      .select(`
        id,
        workout_id,
        exercise_id,

        workout:workouts (
          id,
          workout_date,
          name
        ),

        sets (
          id,
          workout_exercise_id,
          set_number,
          reps,
          weight,
          notes,
          created_at
        )
      `)
      .eq('exercise_id', exerciseId);

  if (error) {

    console.error(
      'Error loading exercise history:',
      error
    );

    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  const history: ExerciseHistory[] = [];

  for (const item of data) {

    const workout = Array.isArray(item.workout)
      ? item.workout[0]
      : item.workout;

    if (!workout) {
      continue;
    }

    history.push({
      workoutId: workout.id,
      workoutDate: workout.workout_date,
      workoutName: workout.name,
      sets: item.sets ?? []
    });
  }

  history.sort(
    (a, b) =>
      new Date(b.workoutDate).getTime() -
      new Date(a.workoutDate).getTime()
  );

  return history;
}
}