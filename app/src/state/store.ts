import { createContext, useContext } from 'react';
import type {
  SessionState,
  Choice,
  Category,
  CategoryStats,
  SkillGrowthItem,
  Question,
} from './types';
import { ALL_CATEGORIES, CATEGORY_DISPLAY_NAMES } from './types';
import { questionBank } from './questionBank';
import { mulberry32, selectNextQuestion, shouldShowReinforcement } from './engine';

// ─── Initial state factory ───

function createInitialStats(): Record<Category, CategoryStats> {
  return {
    same_denominator: { attempts: 0, correct: 0, recentWrongCount: 0 },
    same_numerator: { attempts: 0, correct: 0, recentWrongCount: 0 },
    benchmark_half: { attempts: 0, correct: 0, recentWrongCount: 0 },
    unlike_denominator: { attempts: 0, correct: 0, recentWrongCount: 0 },
  };
}

export function createInitialState(): SessionState {
  return {
    config: { totalQuestions: 6, checkpointIndices: [3, 6], seed: 1337 },
    queue: { questionIds: [], currentIndex: 0 },
    current: { questionId: null, selectedChoice: null },
    ui: {
      showingFeedback: false,
      showingSkillGrowth: false,
      reinforcementShown: false,
      lastFeedbackType: null,
    },
    history: [],
    stats: { byCategory: createInitialStats() },
    phase: 'start',
  };
}

// ─── Actions ───

export type Action =
  | { type: 'START_SESSION' }
  | { type: 'SELECT_CHOICE'; choice: Choice }
  | { type: 'SUBMIT_ANSWER' }
  | { type: 'CONTINUE_AFTER_FEEDBACK' }
  | { type: 'DISMISS_SKILL_GROWTH' }
  | { type: 'RESTART' };

// We need a persistent RNG per session, stored outside reducer
let sessionRng: () => number = Math.random;

export function reducer(state: SessionState, action: Action): SessionState {
  switch (action.type) {
    case 'START_SESSION': {
      const rng = mulberry32(state.config.seed);
      sessionRng = rng;

      const firstQ = selectNextQuestion(
        createInitialStats(),
        [],
        rng
      );
      if (!firstQ) return state;

      return {
        ...state,
        phase: 'workout',
        queue: { questionIds: [firstQ.id], currentIndex: 0 },
        current: { questionId: firstQ.id, selectedChoice: null },
        ui: {
          showingFeedback: false,
          showingSkillGrowth: false,
          reinforcementShown: false,
          lastFeedbackType: null,
        },
        history: [],
        stats: { byCategory: createInitialStats() },
      };
    }

    case 'SELECT_CHOICE': {
      if (state.ui.showingFeedback) return state;
      return {
        ...state,
        current: { ...state.current, selectedChoice: action.choice },
      };
    }

    case 'SUBMIT_ANSWER': {
      const { selectedChoice, questionId } = state.current;
      if (!selectedChoice || !questionId || state.ui.showingFeedback)
        return state;

      const question = questionBank.find((q) => q.id === questionId);
      if (!question) return state;

      const isCorrect = selectedChoice === question.correctChoice;

      // Update stats
      const newStats = { ...state.stats.byCategory };
      const catStats = { ...newStats[question.category] };
      catStats.attempts += 1;
      if (isCorrect) {
        catStats.correct += 1;
        catStats.recentWrongCount = 0;
      } else {
        catStats.recentWrongCount += 1;
      }
      newStats[question.category] = catStats;

      const newHistory = [
        ...state.history,
        {
          questionId,
          category: question.category,
          difficulty: question.difficulty,
          selectedChoice,
          isCorrect,
          timestamp: Date.now(),
        },
      ];

      const showReinforcement =
        isCorrect && shouldShowReinforcement(sessionRng);

      return {
        ...state,
        stats: { byCategory: newStats },
        history: newHistory,
        ui: {
          ...state.ui,
          showingFeedback: true,
          lastFeedbackType: isCorrect ? 'correct' : 'incorrect',
          reinforcementShown: showReinforcement,
        },
      };
    }

    case 'CONTINUE_AFTER_FEEDBACK': {
      const answeredCount = state.history.length;
      const isCheckpoint = state.config.checkpointIndices.includes(answeredCount);

      if (isCheckpoint && !state.ui.showingSkillGrowth) {
        // Show skill growth first
        return {
          ...state,
          ui: {
            ...state.ui,
            showingFeedback: false,
            showingSkillGrowth: true,
          },
        };
      }

      // Check if session is done
      if (answeredCount >= state.config.totalQuestions) {
        return {
          ...state,
          phase: 'summary',
          ui: {
            showingFeedback: false,
            showingSkillGrowth: false,
            reinforcementShown: false,
            lastFeedbackType: null,
          },
        };
      }

      // Pick next question
      const nextQ = selectNextQuestion(
        state.stats.byCategory,
        state.queue.questionIds,
        sessionRng
      );
      if (!nextQ) {
        return { ...state, phase: 'summary' };
      }

      return {
        ...state,
        queue: {
          questionIds: [...state.queue.questionIds, nextQ.id],
          currentIndex: state.queue.currentIndex + 1,
        },
        current: { questionId: nextQ.id, selectedChoice: null },
        ui: {
          showingFeedback: false,
          showingSkillGrowth: false,
          reinforcementShown: false,
          lastFeedbackType: null,
        },
      };
    }

    case 'DISMISS_SKILL_GROWTH': {
      const answeredCount = state.history.length;

      // Check if session is done after checkpoint
      if (answeredCount >= state.config.totalQuestions) {
        return {
          ...state,
          phase: 'summary',
          ui: {
            showingFeedback: false,
            showingSkillGrowth: false,
            reinforcementShown: false,
            lastFeedbackType: null,
          },
        };
      }

      // Pick next question
      const nextQ = selectNextQuestion(
        state.stats.byCategory,
        state.queue.questionIds,
        sessionRng
      );
      if (!nextQ) {
        return { ...state, phase: 'summary' };
      }

      return {
        ...state,
        queue: {
          questionIds: [...state.queue.questionIds, nextQ.id],
          currentIndex: state.queue.currentIndex + 1,
        },
        current: { questionId: nextQ.id, selectedChoice: null },
        ui: {
          showingFeedback: false,
          showingSkillGrowth: false,
          reinforcementShown: false,
          lastFeedbackType: null,
        },
      };
    }

    case 'RESTART': {
      return createInitialState();
    }

    default:
      return state;
  }
}

// ─── Selectors ───

export function selectCurrentQuestion(state: SessionState): Question | null {
  if (!state.current.questionId) return null;
  return questionBank.find((q) => q.id === state.current.questionId) ?? null;
}

export function selectProgress(state: SessionState) {
  return {
    current: state.history.length + (state.phase === 'workout' ? 1 : 0),
    total: state.config.totalQuestions,
    answered: state.history.length,
  };
}

export function selectSkillGrowthSummary(
  state: SessionState
): SkillGrowthItem[] {
  const items: SkillGrowthItem[] = [];
  for (const cat of ALL_CATEGORIES) {
    const s = state.stats.byCategory[cat];
    if (s.attempts === 0) continue;

    const accuracy = s.correct / s.attempts;
    const displayName = CATEGORY_DISPLAY_NAMES[cat];
    let phrase: string;

    if (accuracy >= 0.8) {
      phrase = `Strong consistency in ${displayName}.`;
    } else if (accuracy >= 0.5) {
      phrase = `Improving accuracy in ${displayName}.`;
    } else {
      phrase = `Making steady progress in ${displayName}.`;
    }

    items.push({ category: cat, displayName, phrase });
  }
  return items.slice(0, 3);
}

export function selectCanSubmit(state: SessionState): boolean {
  return (
    state.current.selectedChoice !== null &&
    !state.ui.showingFeedback &&
    state.phase === 'workout'
  );
}

// ─── Context ───

export const SessionContext = createContext<{
  state: SessionState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
