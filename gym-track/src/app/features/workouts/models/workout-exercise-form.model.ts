import { ExerciseComparison } from '../../../core/models/exercise-comparison.model';
import { ExerciseHistory } from '../../../core/models/exercise-history.model';
import { WorkoutSetForm } from './workout-set-form.model';
import { ProgressFeedback } from '../../../core/models/progress-feedback.model';

export interface WorkoutExerciseForm {
  exerciseId: number;
  notes: string;
  sets: WorkoutSetForm[];

  previousPerformance: ExerciseHistory | null;
  loadingPreviousPerformance: boolean;

  comparison: ExerciseComparison | null;

   feedback: ProgressFeedback | null;
}