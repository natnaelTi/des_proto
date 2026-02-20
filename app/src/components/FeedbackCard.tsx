import { useState } from 'react';
import type { Question } from '../state/types';
import { STRATEGY_LINES } from '../state/types';
import { MinimalNumberLine } from './MinimalNumberLine';

interface FeedbackCardProps {
  isCorrect: boolean;
  question: Question;
  reinforcementShown: boolean;
  onNext: () => void;
}

export function FeedbackCard({
  isCorrect,
  question,
  reinforcementShown,
  onNext,
}: FeedbackCardProps) {
  const [showWhy, setShowWhy] = useState(false);
  const strategy = STRATEGY_LINES[question.category];

  return (
    <div
      className={`mt-6 rounded-xl border p-5 ${
        isCorrect
          ? 'border-emerald-200 bg-emerald-50/50'
          : 'border-gray-200 bg-gray-50/50'
      }`}
    >
      <p className="text-lg font-semibold text-gray-800 mb-1">
        {isCorrect ? 'Correct.' : 'Not quite.'}
      </p>

      {isCorrect && reinforcementShown && (
        <p className="text-sm text-gray-600 mb-3">{strategy}</p>
      )}

      {!isCorrect && (
        <>
          <p className="text-sm text-gray-600 mb-2">{strategy}</p>
          {question.visual && (
            <button
              type="button"
              onClick={() => setShowWhy(!showWhy)}
              className="text-sm text-gray-500 underline underline-offset-2 mb-2 cursor-pointer"
            >
              {showWhy ? 'Hide' : 'See why'}
            </button>
          )}
          {showWhy && question.visual && <MinimalNumberLine />}
        </>
      )}

      <button
        onClick={onNext}
        className="mt-3 px-5 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg
          hover:bg-gray-700 transition-colors cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      >
        Next
      </button>
    </div>
  );
}
