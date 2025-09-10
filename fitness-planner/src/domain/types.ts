export type Goal = 'fat_loss' | 'muscle_gain' | 'endurance' | 'general_fitness';

export type Experience = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: number;
  name: string;
  category?: string;
  muscles: string[];
  equipment?: string[];
}

export interface WorkoutExercise {
  exerciseId: number;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  title: string;
  dateISO: string;
  notes?: string;
  items: WorkoutExercise[];
  durationMin?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  goal?: Goal;
  experience?: Experience;
}