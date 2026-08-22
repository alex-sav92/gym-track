import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../../../core/services/exercise.service';
import { Exercise } from '../../../core/models/exercise.model';

@Component({
  selector: 'app-exercise-test',
  standalone: true,
  imports: [],
  templateUrl: './exercise-test.component.html'
})
export class ExerciseTestComponent implements OnInit {

  exercises: Exercise[] = [];
  error = '';
  loading = true;

  constructor(private exerciseService: ExerciseService) {}

  async ngOnInit(): Promise<void> {
    console.log('ExerciseTestComponent initialized');

    try {
      console.log('Loading exercises...');

      this.exercises = await this.exerciseService.getAll();

      console.log('Exercises loaded:', this.exercises);
    } catch (error) {
      console.error('Error loading exercises:', error);

      this.error = error instanceof Error
        ? error.message
        : 'Could not load exercises.';
    } finally {
      this.loading = false;
    }
  }
}