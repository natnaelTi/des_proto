import { describe, expect, it } from 'vitest';
import {
  createInitialState,
  reducer,
  selectCanSubmit,
  selectCheckpointData,
  selectCurrentQuestion,
  selectProgress,
} from './store';

describe('session reducer', () => {
  it('starts a deterministic workout session', () => {
    const initial = createInitialState();
    const first = reducer(initial, { type: 'START_SESSION' });
    const second = reducer(createInitialState(), { type: 'START_SESSION' });

    expect(first.phase).toBe('workout');
    expect(first.current.questionId).not.toBeNull();
    expect(first.current.questionId).toBe(second.current.questionId);
    expect(first.queue.questionIds).toEqual([first.current.questionId]);
    expect(selectProgress(first)).toEqual({ current: 1, total: 6, answered: 0 });
  });

  it('records an answer and updates its category statistics', () => {
    let state = reducer(createInitialState(), { type: 'START_SESSION' });
    const question = selectCurrentQuestion(state);

    expect(question).not.toBeNull();
    state = reducer(state, {
      type: 'SELECT_CHOICE',
      choice: question!.correctChoice,
    });
    expect(selectCanSubmit(state)).toBe(true);

    state = reducer(state, { type: 'SUBMIT_ANSWER' });

    expect(state.history).toHaveLength(1);
    expect(state.history[0]).toMatchObject({
      questionId: question!.id,
      category: question!.category,
      selectedChoice: question!.correctChoice,
      isCorrect: true,
    });
    expect(state.stats.byCategory[question!.category]).toMatchObject({
      attempts: 1,
      correct: 1,
      recentWrongCount: 0,
    });
    expect(state.ui.showingFeedback).toBe(true);
    expect(selectCanSubmit(state)).toBe(false);
  });

  it('provides strategy guidance when no answer is correct', () => {
    let state = reducer(createInitialState(), { type: 'START_SESSION' });
    const question = selectCurrentQuestion(state);
    const wrongChoice = question?.correctChoice === 'A' ? 'B' : 'A';

    state = reducer(state, { type: 'SELECT_CHOICE', choice: wrongChoice });
    state = reducer(state, { type: 'SUBMIT_ANSWER' });

    const checkpoint = selectCheckpointData(state);
    expect(checkpoint.mode).toBe('strategy');
    expect(checkpoint.growthItems).toEqual([]);
    expect(checkpoint.strategyTips).toHaveLength(1);
    expect(checkpoint.strategyTips[0]?.category).toBe(question?.category);
  });

  it('returns to a clean start state when restarted', () => {
    const started = reducer(createInitialState(), { type: 'START_SESSION' });

    expect(reducer(started, { type: 'RESTART' })).toEqual(createInitialState());
  });
});
