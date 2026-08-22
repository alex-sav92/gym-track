import { Injectable } from '@angular/core';

import { ExerciseComparison } from '../models/exercise-comparison.model';
import { ProgressFeedback } from '../models/progress-feedback.model';

@Injectable({
  providedIn: 'root'
})
export class ProgressFeedbackService {

  generate(
    comparison: ExerciseComparison
  ): ProgressFeedback {

    if (comparison.status === 'no-history') {
      return {
        type: 'no-history',
        title: 'First time! 💪',
        message:
          'There is no previous performance for this exercise yet.'
      };
    }

    /*
     * Improvement
     */
    if (comparison.status === 'improved') {

      if (
        comparison.volumePercentage >= 5
      ) {

        return {
          type: 'improvement',
          title: 'Great progress! 🎉',
          message:
            `Your training volume increased by ` +
            `${this.formatPercentage(
              comparison.volumePercentage
            )} compared with your previous session.`,
          metric: 'volume',
          value: comparison.volumePercentage
        };
      }

      if (
        comparison.estimated1RMPercentage !== null &&
        comparison.estimated1RMPercentage >= 5
      ) {

        return {
          type: 'improvement',
          title: 'Getting stronger! 💪',
          message:
            `Your estimated 1RM increased by ` +
            `${this.formatPercentage(
              comparison.estimated1RMPercentage
            )}.`,
          metric: 'estimated1RM',
          value: comparison.estimated1RMPercentage
        };
      }
    }

    /*
     * Decline
     */
    if (comparison.status === 'declined') {

      return {
        type: 'decline',
        title: 'A lighter session? 🤔',
        message:
          `Your performance was lower than your previous session. ` +
          `That is not necessarily a problem — recovery, sleep, ` +
          `nutrition and exercise order can all affect performance. ` +
          `How are you feeling today?`,
        metric: 'volume',
        value: comparison.volumePercentage
      };
    }

    /*
     * Stable
     */
    return {
      type: 'stable',
      title: 'Solid session 👍',
      message:
        'Your performance is broadly in line with your previous session.'
    };
  }

  private formatPercentage(
    value: number
  ): string {

    const rounded =
      Math.round(value * 10) / 10;

    return `${rounded > 0 ? '+' : ''}${rounded}%`;
  }
}