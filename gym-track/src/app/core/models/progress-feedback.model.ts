export type ProgressFeedbackType =
  | 'improvement'
  | 'stable'
  | 'decline'
  | 'no-history';

export interface ProgressFeedback {
  type: ProgressFeedbackType;
  title: string;
  message: string;
  metric?: string;
  value?: number;
}