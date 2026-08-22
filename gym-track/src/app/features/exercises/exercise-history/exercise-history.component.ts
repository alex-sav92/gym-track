import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';

import { DecimalPipe } from '@angular/common';

import { ExerciseService }
  from '../../../core/services/exercise.service';

import { ProgressService }
  from '../../../core/services/progress.service';

import { ExerciseHistorySummary }
  from '../../../core/models/exercise-history-summary.model';
import {
  Chart,
  ChartConfiguration
} from 'chart.js/auto';
import { ExerciseHistory } from '../../../core/models/exercise-history.model';

@Component({
  selector: 'app-exercise-history',
  standalone: true,
  imports: [
    DecimalPipe
  ],
  templateUrl: './exercise-history.component.html'
})
export class ExerciseHistoryComponent
  implements OnChanges, OnDestroy  {

  @Input({ required: true })
  exerciseId!: number;

  @Input({ required: true })
  exerciseName!: string;

  summary: ExerciseHistorySummary | null = null;

  maxWeightChart?: Chart;
  volumeChart?: Chart;

  @ViewChild('maxWeightCanvas')
maxWeightCanvas?: ElementRef<HTMLCanvasElement>;

@ViewChild('volumeCanvas')
volumeCanvas?: ElementRef<HTMLCanvasElement>;

  loading = false;

  constructor(
    private exerciseService: ExerciseService,
    private progressService: ProgressService
  ) {}

  async ngOnChanges(
    changes: SimpleChanges
  ): Promise<void> {

    if (
      changes['exerciseId'] &&
      this.exerciseId
    ) {

      await this.loadHistory();
    }
  }

  private async loadHistory(): Promise<void> {

    this.loading = true;

    try {

      const sessions =
        await this.exerciseService
          .getExerciseHistory(
            this.exerciseId
          );

      this.summary =
        this.progressService
          .createHistorySummary(
            this.exerciseId,
            this.exerciseName,
            sessions
          );
      setTimeout(() => {
      this.renderCharts(sessions);
      });

    } catch (error) {

      console.error(
        'Error loading exercise history:',
        error
      );

      this.summary = null;

    } finally {

      this.loading = false;
    }
  }

  getSessionVolume(
    session: any
  ): number {

    return session.sets.reduce(
      (total: number, set: any) =>
        total +
        (set.weight ?? 0) *
        (set.reps ?? 0),
      0
    );
  }

  getSessionMaxWeight(
    session: any
  ): number | null {

    const weights =
      session.sets
        .map((set: any) => set.weight)
        .filter(
          (weight: number | null) =>
            weight !== null &&
            weight > 0
        );

    return weights.length
      ? Math.max(...weights)
      : null;
  }
  private renderCharts(
  sessions: ExerciseHistory[]
): void {

  if (
    !this.maxWeightCanvas ||
    !this.volumeCanvas
  ) {
    return;
  }

  const chartData =
    this.progressService.createChartData(
      sessions
    );

  this.maxWeightChart?.destroy();
  this.volumeChart?.destroy();

  this.maxWeightChart =
    new Chart(
      this.maxWeightCanvas.nativeElement,
      {
        type: 'line',

        data: {
          labels: chartData.maxWeight.map(
            point => point.date
          ),

          datasets: [
            {
              label: 'Max weight (kg)',

              data: chartData.maxWeight.map(
                point => point.value
              ),

              tension: 0.3
            }
          ]
        },

        options: {
          responsive: true,

          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      }
    );

  this.volumeChart =
    new Chart(
      this.volumeCanvas.nativeElement,
      {
        type: 'line',

        data: {
          labels: chartData.volume.map(
            point => point.date
          ),

          datasets: [
            {
              label: 'Volume (kg)',

              data: chartData.volume.map(
                point => point.value
              ),

              tension: 0.3
            }
          ]
        },

        options: {
          responsive: true,

          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      }
    );
}
ngOnDestroy(): void {

  this.maxWeightChart?.destroy();

  this.volumeChart?.destroy();
}
}