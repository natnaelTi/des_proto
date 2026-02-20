export type Category =
  | 'same_denominator'
  | 'same_numerator'
  | 'benchmark_half'
  | 'unlike_denominator';

export type Choice = 'A' | 'B';

export interface Fraction {
  n: number;
  d: number;
}

export interface QuestionVisual {
  type: 'number_line';
  marks: number[];
  highlight: number;
}

export interface Question {
  id: string;
  a: Fraction;
  b: Fraction;
  correctChoice: Choice;
  category: Category;
  difficulty: number; // 1–3
  visual?: QuestionVisual;
}

export interface AnswerRecord {
  questionId: string;
  category: Category;
  difficulty: number;
  selectedChoice: Choice;
  isCorrect: boolean;
  timestamp: number;
}

export interface CategoryStats {
  attempts: number;
  correct: number;
  recentWrongCount: number;
}

export interface SessionConfig {
  totalQuestions: number;
  checkpointIndices: number[];
  seed: number;
}

export interface SessionState {
  config: SessionConfig;
  queue: {
    questionIds: string[];
    currentIndex: number;
  };
  current: {
    questionId: string | null;
    selectedChoice: Choice | null;
  };
  ui: {
    showingFeedback: boolean;
    showingSkillGrowth: boolean;
    reinforcementShown: boolean;
    lastFeedbackType: 'correct' | 'incorrect' | null;
  };
  history: AnswerRecord[];
  stats: {
    byCategory: Record<Category, CategoryStats>;
  };
  phase: 'start' | 'workout' | 'summary';
}

export interface SkillGrowthItem {
  category: Category;
  displayName: string;
  phrase: string;
}

export const CATEGORY_DISPLAY_NAMES: Record<Category, string> = {
  same_denominator: 'same-denominator comparisons',
  same_numerator: 'same-numerator comparisons',
  benchmark_half: 'benchmark comparisons',
  unlike_denominator: 'unlike-denominator comparisons',
};

export const STRATEGY_LINES: Record<Category, string> = {
  same_denominator: 'Same denominators: compare the numerators.',
  same_numerator: 'Same numerator: the smaller denominator is larger pieces.',
  benchmark_half:
    'Use 1/2 as a benchmark. Is each fraction above or below 1/2?',
  unlike_denominator:
    'When denominators differ, compare using a common denominator or a benchmark like 1/2.',
};

export const ALL_CATEGORIES: Category[] = [
  'same_denominator',
  'same_numerator',
  'benchmark_half',
  'unlike_denominator',
];
