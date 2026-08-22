import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorkoutEditorComponent } from './features/workouts/workout-editor/workout-editor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WorkoutEditorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gym-track';
}
