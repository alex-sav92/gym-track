export interface Exercise {
  id: number;
  name: string;
  muscle_group: string | null;
  notes: string | null;
  created_at: string;
  is_assistance: boolean;
}