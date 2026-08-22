import { Injectable } from '@angular/core';

import { ExerciseComparison } from '../models/exercise-comparison.model';
import { ExerciseHistory } from '../models/exercise-history.model';
import { WorkoutSetForm } from '../../features/workouts/models/workout-set-form.model';
import { ExerciseHistorySummary } from '../models/exercise-history-summary.model';
import { ExerciseChartData } from '../models/exercise-chart-data.model';
@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  compare(
    previous: ExerciseHistory | null,
    currentSets: WorkoutSetForm[]
  ): ExerciseComparison {

    if (!previous) {
      return {
        previousVolume: 0,
        currentVolume: this.calculateVolume(currentSets),
        volumeDifference: 0,
        volumePercentage: 0,

        previousMaxWeight: null,
        currentMaxWeight: this.getMaxWeight(currentSets),
        maxWeightDifference: null,
        maxWeightPercentage: null,

        previousMaxReps: null,
        currentMaxReps: this.getMaxReps(currentSets),
        maxRepsDifference: null,

        estimatedPrevious1RM: null,
        estimatedCurrent1RM: this.getEstimated1RM(currentSets),
        estimated1RMDifference: null,
        estimated1RMPercentage: null,

        status: 'no-history'
      };
    }

    const previousVolume =
      this.calculateHistoricalVolume(previous);

    const currentVolume =
      this.calculateVolume(currentSets);

    const previousMaxWeight =
      this.getHistoricalMaxWeight(previous);

    const currentMaxWeight =
      this.getMaxWeight(currentSets);

    const previousMaxReps =
      this.getHistoricalMaxReps(previous);

    const currentMaxReps =
      this.getMaxReps(currentSets);

    const estimatedPrevious1RM =
      this.getHistorical1RM(previous);

    const estimatedCurrent1RM =
      this.getEstimated1RM(currentSets);

    const volumeDifference =
      currentVolume - previousVolume;

    const volumePercentage =
      this.calculatePercentage(
        previousVolume,
        currentVolume
      );

    const maxWeightDifference =
      this.calculateDifference(
        previousMaxWeight,
        currentMaxWeight
      );

    const maxWeightPercentage =
      this.calculatePercentage(
        previousMaxWeight,
        currentMaxWeight
      );

    const estimated1RMDifference =
      this.calculateDifference(
        estimatedPrevious1RM,
        estimatedCurrent1RM
      );

    const estimated1RMPercentage =
      this.calculatePercentage(
        estimatedPrevious1RM,
        estimatedCurrent1RM
      );

    return {
      previousVolume,
      currentVolume,
      volumeDifference,
      volumePercentage,

      previousMaxWeight,
      currentMaxWeight,
      maxWeightDifference,
      maxWeightPercentage,

      previousMaxReps,
      currentMaxReps,
      maxRepsDifference:
        this.calculateDifference(
          previousMaxReps,
          currentMaxReps
        ),

      estimatedPrevious1RM,
      estimatedCurrent1RM,
      estimated1RMDifference,
      estimated1RMPercentage,

      status: this.determineStatus(
        volumePercentage,
        estimated1RMPercentage
      )
    };
  }

  private calculateVolume(
    sets: WorkoutSetForm[]
  ): number {

    return sets.reduce(
      (total, set) =>
        total +
        (set.weight ?? 0) *
        (set.reps ?? 0),
      0
    );
  }

  private calculateHistoricalVolume(
    history: ExerciseHistory
  ): number {

    return history.sets.reduce(
      (total, set) =>
        total +
        (set.weight ?? 0) *
        (set.reps ?? 0),
      0
    );
  }

  private getMaxWeight(
    sets: WorkoutSetForm[]
  ): number | null {

    const weights = sets
      .map(set => set.weight)
      .filter(
        (weight): weight is number =>
          weight !== null &&
          weight > 0
      );

    return weights.length
      ? Math.max(...weights)
      : null;
  }

  private getHistoricalMaxWeight(
    history: ExerciseHistory
  ): number | null {

    const weights = history.sets
      .map(set => set.weight)
      .filter(
        (weight): weight is number =>
          weight !== null &&
          weight > 0
      );

    return weights.length
      ? Math.max(...weights)
      : null;
  }

  private getMaxReps(
    sets: WorkoutSetForm[]
  ): number | null {

    const reps = sets
      .map(set => set.reps)
      .filter(
        (value): value is number =>
          value !== null &&
          value > 0
      );

    return reps.length
      ? Math.max(...reps)
      : null;
  }

  private getHistoricalMaxReps(
    history: ExerciseHistory
  ): number | null {

    const reps = history.sets
      .map(set => set.reps)
      .filter(
        (value): value is number =>
          value !== null &&
          value > 0
      );

    return reps.length
      ? Math.max(...reps)
      : null;
  }

  /**
   * Epley formula:
   *
   * 1RM = weight × (1 + reps / 30)
   */
  private getEstimated1RM(
    sets: WorkoutSetForm[]
  ): number | null {

    const estimates = sets
      .filter(
        set =>
          set.weight !== null &&
          set.reps !== null &&
          set.weight > 0 &&
          set.reps > 0
      )
      .map(
        set =>
          set.weight! *
          (1 + set.reps! / 30)
      );

    return estimates.length
      ? Math.max(...estimates)
      : null;
  }

  private getHistorical1RM(
    history: ExerciseHistory
  ): number | null {

    const estimates = history.sets
      .filter(
        set =>
          set.weight !== null &&
          set.reps !== null &&
          set.weight > 0 &&
          set.reps > 0
      )
      .map(
        set =>
          set.weight! *
          (1 + set.reps! / 30)
      );

    return estimates.length
      ? Math.max(...estimates)
      : null;
  }

  private calculateDifference(
    previous: number | null,
    current: number | null
  ): number | null {

    if (
      previous === null ||
      current === null
    ) {
      return null;
    }

    return current - previous;
  }

  private calculatePercentage(
    previous: number | null,
    current: number | null
  ): number {

    if (
      previous === null ||
      previous === 0 ||
      current === null
    ) {
      return 0;
    }

    return (
      ((current - previous) / previous) * 100
    );
  }

  private determineStatus(
    volumePercentage: number,
    oneRMPercentage: number
  ): 'improved' | 'declined' | 'similar' {

    const improvement =
      Math.max(
        volumePercentage,
        oneRMPercentage
      );

    const decline =
      Math.min(
        volumePercentage,
        oneRMPercentage
      );

    if (improvement >= 5) {
      return 'improved';
    }

    if (decline <= -10) {
      return 'declined';
    }

    return 'similar';
  }

  createHistorySummary(
  exerciseId: number,
  exerciseName: string,
  sessions: ExerciseHistory[]
): ExerciseHistorySummary {

  if (sessions.length === 0) {

    return {
      exerciseId,
      exerciseName,
      sessions: [],
      bestWeight: null,
      bestReps: null,
      bestVolume: 0,
      firstRecordedWeight: null,
      latestWeight: null
    };
  }

  const allSets =
    sessions.flatMap(
      session => session.sets
    );

  const weights = allSets
    .map(set => set.weight)
    .filter(
      (weight): weight is number =>
        weight !== null &&
        weight > 0
    );

  const reps = allSets
    .map(set => set.reps)
    .filter(
      (reps): reps is number =>
        reps !== null &&
        reps > 0
    );

  const bestWeight =
    weights.length
      ? Math.max(...weights)
      : null;

  const bestReps =
    reps.length
      ? Math.max(...reps)
      : null;

  const sessionVolumes =
    sessions.map(session =>
      session.sets.reduce(
        (total, set) =>
          total +
          (set.weight ?? 0) *
          (set.reps ?? 0),
        0
      )
    );

  const bestVolume =
    sessionVolumes.length
      ? Math.max(...sessionVolumes)
      : 0;

  const firstSession =
    sessions[sessions.length - 1];

  const latestSession =
    sessions[0];

  const firstRecordedWeight =
    this.getSessionMaxWeight(
      firstSession
    );

  const latestWeight =
    this.getSessionMaxWeight(
      latestSession
    );

  return {
    exerciseId,
    exerciseName,
    sessions,

    bestWeight,
    bestReps,
    bestVolume,

    firstRecordedWeight,
    latestWeight
  };
}
private getSessionMaxWeight(
  session: ExerciseHistory
): number | null {

  const weights = session.sets
    .map(set => set.weight)
    .filter(
      (weight): weight is number =>
        weight !== null &&
        weight > 0
    );

  return weights.length
    ? Math.max(...weights)
    : null;
}
createChartData(
  sessions: ExerciseHistory[]
): ExerciseChartData {

  const orderedSessions = [
    ...sessions
  ].sort(
    (a, b) =>
      new Date(a.workoutDate).getTime() -
      new Date(b.workoutDate).getTime()
  );

  const maxWeight =
    orderedSessions
      .map(session => {

        const weights =
          session.sets
            .map(set => set.weight)
            .filter(
              (weight): weight is number =>
                weight !== null &&
                weight > 0
            );

        return {
          date: session.workoutDate,
          value: weights.length
            ? Math.max(...weights)
            : 0
        };
      })
      .filter(point => point.value > 0);

  const volume =
    orderedSessions
      .map(session => {

        const total =
          session.sets.reduce(
            (sum, set) =>
              sum +
              (set.weight ?? 0) *
              (set.reps ?? 0),
            0
          );

        return {
          date: session.workoutDate,
          value: total
        };
      })
      .filter(point => point.value > 0);

  return {
    maxWeight,
    volume
  };
}
}