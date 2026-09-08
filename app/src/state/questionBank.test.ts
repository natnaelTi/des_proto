import { describe, expect, it } from 'vitest';
import { questionBank } from './questionBank';

describe('questionBank', () => {
  it('contains unique question ids', () => {
    const ids = questionBank.map((question) => question.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('contains valid, non-equal fractions and supported difficulty values', () => {
    for (const question of questionBank) {
      expect(question.a.d).toBeGreaterThan(0);
      expect(question.b.d).toBeGreaterThan(0);
      expect(question.a.n * question.b.d).not.toBe(
        question.b.n * question.a.d
      );
      expect([1, 2, 3]).toContain(question.difficulty);
    }
  });

  it('stores the mathematically correct choice for every question', () => {
    for (const question of questionBank) {
      const expectedChoice =
        question.a.n * question.b.d > question.b.n * question.a.d ? 'A' : 'B';

      expect(question.correctChoice, question.id).toBe(expectedChoice);
    }
  });
});
