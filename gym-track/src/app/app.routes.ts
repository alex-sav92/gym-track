import { Routes } from '@angular/router';
import { LastWorkoutComponent } from './features/workouts/last-workout/last-workout.component';
import { WorkoutEditorComponent } from './features/workouts/workout-editor/workout-editor.component';
import { WorkoutHistoryComponent } from './features/workouts/workout-history/workout-history.component';

export const routes: Routes = [
{
    path: '',
    component: WorkoutEditorComponent
  },
  {
    path: 'last-workout',
    component: LastWorkoutComponent
  },
  { 
    path: 'workout-history', 
    component: WorkoutHistoryComponent 
  },
  {
    path: '**',
    redirectTo: '',
  }
];