// Tipos para el sistema de actividades interactivas

export type ActivityType = 'multiple-choice' | 'drag-drop' | 'match-lines' | 'short-answer' | 'video';

export interface BaseActivity {
  type: ActivityType;
  question: string;
}

export interface MultipleChoiceActivity extends BaseActivity {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: number;
}

export interface DragDropActivity extends BaseActivity {
  type: 'drag-drop';
  items: string[];
  correctOrder: number[];
}

export interface MatchLinesActivity extends BaseActivity {
  type: 'match-lines';
  leftItems: string[];
  rightItems: string[];
  correctMatches: number[];
}

export interface ShortAnswerActivity extends BaseActivity {
  type: 'short-answer';
  correctAnswer: string;
}

export interface VideoActivity extends BaseActivity {
  type: 'video';
  videoUrl: string;
}

export type Activity = 
  | MultipleChoiceActivity 
  | DragDropActivity 
  | MatchLinesActivity 
  | ShortAnswerActivity 
  | VideoActivity;

export interface Task {
  id: string;
  title: string;
  description: string;
  activities: Activity[];
  createdAt: string;
  subjectId?: string;
  teacherId?: string;
  institutionId?: string;
  isActive?: boolean;
}

export interface Result {
  id: string;
  taskId: string;
  studentName: string;
  answers: Record<number, any>;
  score: number;
  completedAt: string;
}

export interface ActivityProgress {
  taskId: string;
  activityIndex: number;
  completed: boolean;
  score: number;
  attempts: number;
}