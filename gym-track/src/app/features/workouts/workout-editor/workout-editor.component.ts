import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WorkoutService } from '../../../core/services/workout.service';
import { Exercise } from '../../../core/models/exercise.model';
import { ExerciseService } from '../../../core/services/exercise.service';
import { WorkoutExerciseForm } from '../models/workout-exercise-form.model';
import { WorkoutSetForm } from '../models/workout-set-form.model';
import { WorkoutForm } from '../models/workout-form.model';
import { ProgressService } from '../../../core/services/progress.service';
import { DecimalPipe } from '@angular/common';
import { ProgressFeedbackService } from '../../../core/services/progress-feedback.service';
import { ExerciseHistoryComponent } from '../../exercises/exercise-history/exercise-history.component';

@Component({
  selector: 'app-workout-editor',
  standalone: true,
  imports: [FormsModule, DecimalPipe, ExerciseHistoryComponent],
  templateUrl: './workout-editor.component.html',
  styleUrl: './workout-editor.component.css'
})
export class WorkoutEditorComponent implements OnInit {
getExerciseName(
  exerciseId: number
): string {

  return this.exercises.find(
    exercise => exercise.id === exerciseId
  )?.name ?? '';
}
exercises: Exercise[] = [];

  workout: WorkoutForm = {
    workoutDate: this.getToday(),
    name: '',
    notes: '',
    exercises: []
  };

  saving = false;
  loadingExercises = true;
  message = '';

  constructor(
    private exerciseService: ExerciseService,
    private workoutService: WorkoutService,
    private progressService: ProgressService,
    private progressFeedbackService: ProgressFeedbackService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.exercises = await this.exerciseService.getAll();
    } catch (error) {
      console.error(error);
      this.message = 'Could not load exercises.';
    } finally {
      this.loadingExercises = false;
    }
  }

  private getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

 async addExercise(): Promise<void> {

  if (this.exercises.length === 0) {
    return;
  }

  const newExercise: WorkoutExerciseForm = {
    exerciseId: this.exercises[0].id,

    notes: '',

    sets: [
      this.createSet(1)
    ],

    previousPerformance: null,

    loadingPreviousPerformance: true,
    comparison: null,
     feedback: null
  };

  this.workout.exercises.push(newExercise);

  await this.loadPreviousPerformance(
    newExercise
  );
}

  removeExercise(index: number): void {
    this.workout.exercises.splice(index, 1);
  }

  addSet(exercise: WorkoutExerciseForm): void {
    exercise.sets.push(
      this.createSet(exercise.sets.length + 1)
    );
  }

  removeSet(
    exercise: WorkoutExerciseForm,
    index: number
  ): void {

    exercise.sets.splice(index, 1);

    exercise.sets.forEach((set, i) => {
      set.setNumber = i + 1;
    });
  }

  private createSet(setNumber: number): WorkoutSetForm {
    return {
      setNumber,
      reps: null,
      weight: null,
      notes: ''
    };
  }

  async saveWorkout(): Promise<void> {

  if (!this.workout.name.trim()) {
    this.message = 'Please enter a workout name.';
    return;
  }

  if (this.workout.exercises.length === 0) {
    this.message = 'Add at least one exercise.';
    return;
  }

  this.saving = true;
  this.message = '';

  try {

    const workoutId =
      await this.workoutService.createWorkout(
        this.workout
      );

    console.log('Workout created:', workoutId);

    this.message =
      'Workout saved successfully!';

  } catch (error) {

    console.error(
      'Error saving workout:',
      error
    );

    this.message =
      'Failed to save workout.';

  } finally {

    this.saving = false;
  }
}
private async loadPreviousPerformance(
  workoutExercise: WorkoutExerciseForm
): Promise<void> {

  workoutExercise.loadingPreviousPerformance = true;

  try {

    const history =
      await this.exerciseService.getLatestPerformance(
        workoutExercise.exerciseId
      );

    workoutExercise.previousPerformance = history;

    workoutExercise.comparison =
      this.progressService.compare(
        history,
        workoutExercise.sets
      );
    
    workoutExercise.feedback =
      this.progressFeedbackService.generate(
        workoutExercise.comparison
    );

  } catch (error) {

    console.error(
      'Could not load previous performance:',
      error
    );

    workoutExercise.previousPerformance = null;
    workoutExercise.comparison = null;

  } finally {

    workoutExercise.loadingPreviousPerformance = false;
  }
}
async onExerciseChanged(
  workoutExercise: WorkoutExerciseForm,
  exerciseId: number
): Promise<void> {

  workoutExercise.exerciseId = exerciseId;

  workoutExercise.previousPerformance = null;

  await this.loadPreviousPerformance(
    workoutExercise
  );
}
updateComparison(
  workoutExercise: WorkoutExerciseForm
): void {

  workoutExercise.comparison =
    this.progressService.compare(
      workoutExercise.previousPerformance,
      workoutExercise.sets
    );

  workoutExercise.feedback =
    this.progressFeedbackService.generate(
      workoutExercise.comparison
    );
}
}