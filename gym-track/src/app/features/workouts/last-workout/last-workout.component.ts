
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WorkoutService } from '../../../core/services/workout.service';

@Component({
  selector: 'app-last-workout',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './last-workout.component.html',
  styleUrl: './last-workout.component.css'
})
export class LastWorkoutComponent implements OnInit {

getTotalSets(): number {
  return this.workout?.workout_exercises?.reduce(
    (total: number, exercise: any) =>
      total + (exercise.sets?.length ?? 0),
    0
  ) ?? 0;
}

  workout: any | null = null;
  loading = true;
  error = '';

  constructor(
    private workoutService: WorkoutService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.workout =
        await this.workoutService.getLatestWorkout();
    } catch (err) {
      console.error('Could not load last workout:', err);
      this.error = 'Could not load your last workout.';
    } finally {
      this.loading = false;
    }
  }
}