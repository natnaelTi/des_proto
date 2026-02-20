import type { Category, CategoryStats, Question } from './types';
import { ALL_CATEGORIES } from './types';
import { questionBank } from './questionBank';

// Mulberry32 seeded PRNG
export function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function selectNextQuestion(
  stats: Record<Category, CategoryStats>,
  usedIds: string[],
  rng: () => number
): Question | null {
  // 1) Compute weights per category based on accuracy
  const weights: Record<Category, number> = {} as Record<Category, number>;
  for (const cat of ALL_CATEGORIES) {
    const s = stats[cat];
    if (s.attempts === 0) {
      weights[cat] = 1;
    } else {
      const accuracy = s.correct / s.attempts;
      // Lower accuracy → higher weight (more practice needed)
      weights[cat] = 1 + (1 - accuracy) * 2;
    }
  }

  // 2) Choose category by weighted random
  const totalWeight = ALL_CATEGORIES.reduce((sum, c) => sum + weights[c], 0);
  let r = rng() * totalWeight;
  let chosenCategory: Category = ALL_CATEGORIES[0];
  for (const cat of ALL_CATEGORIES) {
    r -= weights[cat];
    if (r <= 0) {
      chosenCategory = cat;
      break;
    }
  }

  // 3) Determine target difficulty
  const catStats = stats[chosenCategory];
  let targetDifficulty: number;

  if (catStats.recentWrongCount >= 2) {
    // Reduce difficulty after repeated errors
    const currentDiff = getLastDifficulty(chosenCategory, usedIds);
    targetDifficulty = Math.max(1, currentDiff - 1);
  } else if (catStats.attempts === 0) {
    targetDifficulty = 1;
  } else {
    const accuracy = catStats.correct / catStats.attempts;
    if (accuracy >= 0.8) {
      targetDifficulty = 3;
    } else if (accuracy >= 0.5) {
      targetDifficulty = 2;
    } else {
      targetDifficulty = 1;
    }
  }

  // 4) Find matching question not already used
  const candidates = questionBank.filter(
    (q) =>
      q.category === chosenCategory &&
      !usedIds.includes(q.id)
  );

  if (candidates.length === 0) {
    // Fallback: try any category with unused questions
    const fallback = questionBank.filter((q) => !usedIds.includes(q.id));
    if (fallback.length === 0) return null;
    return fallback[Math.floor(rng() * fallback.length)];
  }

  // Prefer questions matching target difficulty, but allow nearby
  const exact = candidates.filter((q) => q.difficulty === targetDifficulty);
  if (exact.length > 0) {
    return exact[Math.floor(rng() * exact.length)];
  }

  // Try ±1 difficulty
  const near = candidates.filter(
    (q) => Math.abs(q.difficulty - targetDifficulty) <= 1
  );
  if (near.length > 0) {
    return near[Math.floor(rng() * near.length)];
  }

  return candidates[Math.floor(rng() * candidates.length)];
}

function getLastDifficulty(category: Category, usedIds: string[]): number {
  // Find the last used question in this category
  for (let i = usedIds.length - 1; i >= 0; i--) {
    const q = questionBank.find((x) => x.id === usedIds[i]);
    if (q && q.category === category) {
      return q.difficulty;
    }
  }
  return 2; // default
}

export function shouldShowReinforcement(rng: () => number): boolean {
  return rng() < 0.3;
}
