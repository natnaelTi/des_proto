import { describe, expect, it } from 'vitest';
import { mulberry32, selectNextQuestion, shouldShowReinforcement } from './engine';
import { questionBank } from './questionBank';
import type { Category, CategoryStats } from './types';

function createStats(): Record<Category, CategoryStats> {
  return {
    same_denominator: { attempts: 0, correct: 0, recentWrongCount: 0 },
    same_numerator: { attempts: 0, correct: 0, recentWrongCount: 0 },
    benchmark_half: { attempts: 0, correct: 0, recentWrongCount: 0 },
    unlike_denominator: { attempts: 0, correct: 0, recentWrongCount: 0 },
  };
}

describe('mulberry32', () => {
  it('produces a deterministic sequence for the same seed', () => {
    const first = mulberry32(1337);
    const second = mulberry32(1337);

    expect(Array.from({ length: 8 }, first)).toEqual(
      Array.from({ length: 8 }, second)
    );
  });

  it('only produces values in the interval [0, 1)', () => {
    const rng = mulberry32(42);
    const values = Array.from({ length: 100 }, rng);

    expect(values.every((value) => value >= 0 && value < 1)).toBe(true);
  });
});

describe('selectNextQuestion', () => {
  it('selects questions deterministically and never repeats an id', () => {
    const rng = mulberry32(2026);
    const usedIds: string[] = [];

    for (let index = 0; index < 12; index += 1) {
      const question = selectNextQuestion(createStats(), usedIds, rng);

      expect(question).not.toBeNull();
      expect(usedIds).not.toContain(question?.id);
      usedIds.push(question!.id);
    }

    expect(new Set(usedIds).size).toBe(usedIds.length);
  });

  it('falls back to another category when the selected category is exhausted', () => {
    const usedIds = questionBank
      .filter((question) => question.category === 'same_denominator')
      .map((question) => question.id);

    const question = selectNextQuestion(createStats(), usedIds, () => 0);

    expect(question).not.toBeNull();
    expect(question?.category).not.toBe('same_denominator');
    expect(usedIds).not.toContain(question?.id);
  });

  it('returns null after every question has been used', () => {
    const usedIds = questionBank.map((question) => question.id);

    expect(selectNextQuestion(createStats(), usedIds, () => 0)).toBeNull();
  });
});

describe('shouldShowReinforcement', () => {
  it('uses a strict 30 percent threshold', () => {
    expect(shouldShowReinforcement(() => 0.299)).toBe(true);
    expect(shouldShowReinforcement(() => 0.3)).toBe(false);
  });
});
