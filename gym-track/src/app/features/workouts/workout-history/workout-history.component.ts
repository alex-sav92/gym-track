
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WorkoutService } from '../../../core/services/workout.service';

interface WorkoutHistoryItem {
  id: number;
  workout_date: string;
  name: string | null;
  notes: string | null;
}

@Component({
  selector: 'app-workout-history',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './workout-history.component.html',
  styleUrl: './workout-history.component.css'
})
export class WorkoutHistoryComponent implements OnInit {
  workouts: WorkoutHistoryItem[] = [];
  loading = true;
  error = '';

  constructor(private workoutService: WorkoutService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.workouts = await this.workoutService.getAllWorkouts();
    } catch (err) {
      console.error('Could not load workout history:', err);
      this.error = 'Could not load your workout history.';
    } finally {
      this.loading = false;
    }
  }
}
