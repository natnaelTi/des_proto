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
      className={`mt-4 sm:mt-6 rounded-xl border p-4 sm:p-5 ${
        isCorrect
          ? 'border-emerald-200 bg-emerald-50/50'
          : 'border-gray-200 bg-gray-50/50'
      }`}
    >
      <p className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
        {isCorrect ? 'Correct.' : 'Not quite.'}
      </p>

      {isCorrect && reinforcementShown && (
        <p className="text-sm text-gray-600 mb-3">{strategy}</p>
      )}

      {!isCorrect && (
        <>
          <p className="text-sm text-gray-600 mb-3">{strategy}</p>
          {question.visual && (
            <div className="mb-3">
              <button
                type="button"
                onClick={() => setShowWhy(!showWhy)}
                className="text-sm text-gray-500 underline underline-offset-2 cursor-pointer"
              >
                {showWhy ? 'Hide' : 'See Why'}
              </button>
              {showWhy && <MinimalNumberLine />}
            </div>
          )}
        </>
      )}

      <button
        onClick={onNext}
        className="mt-2 px-5 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg
          hover:bg-gray-700 transition-colors cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      >
        Next
      </button>
    </div>
  );
}
