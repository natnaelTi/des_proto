import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession, selectCurrentQuestion, selectProgress, selectCheckpointData, selectSkillGrowthSummary, selectCanSubmit } from '../state/store';
import { ProgressBar } from '../components/ProgressBar';
import { FractionOptionCard } from '../components/FractionOptionCard';
import { FeedbackCard } from '../components/FeedbackCard';
import { SkillGrowthPanel } from '../components/SkillGrowthPanel';
import { StrategyReferencePanel } from '../components/StrategyReferencePanel';

export function WorkoutPage() {
  const { state, dispatch } = useSession();
  const navigate = useNavigate();
  const question = selectCurrentQuestion(state);
  const progress = selectProgress(state);
  const canSubmit = selectCanSubmit(state);
  const [showStrategies, setShowStrategies] = useState(false);

  useEffect(() => {
    if (state.phase === 'start') navigate('/', { replace: true });
    if (state.phase === 'summary') navigate('/summary', { replace: true });
  }, [state.phase, navigate]);

  if (!question) return null;

  const showingFeedback = state.ui.showingFeedback;
  const lastAnswer = state.history[state.history.length - 1];

  const getHighlight = (label: 'A' | 'B') => {
    if (!showingFeedback || !lastAnswer) return null;
    if (label === question.correctChoice) return 'correct' as const;
    if (label === lastAnswer.selectedChoice && !lastAnswer.isCorrect) return 'incorrect' as const;
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="px-4 py-4 max-w-lg mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar
              currentIndex={progress.current}
              totalQuestions={progress.total}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowStrategies(true)}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer whitespace-nowrap"
          >
            Strategies
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-start justify-center px-4 pt-8">
        <div className="max-w-lg w-full">
          <p className="text-center text-gray-600 text-lg mb-8">
            Which is larger?
          </p>

          <div className="flex justify-center gap-6">
            <FractionOptionCard
              label="A"
              fraction={question.a}
              selected={state.current.selectedChoice === 'A'}
              disabled={showingFeedback}
              correctHighlight={getHighlight('A')}
              onSelect={() => dispatch({ type: 'SELECT_CHOICE', choice: 'A' })}
            />
            <FractionOptionCard
              label="B"
              fraction={question.b}
              selected={state.current.selectedChoice === 'B'}
              disabled={showingFeedback}
              correctHighlight={getHighlight('B')}
              onSelect={() => dispatch({ type: 'SELECT_CHOICE', choice: 'B' })}
            />
          </div>

          {/* Check button */}
          {!showingFeedback && (
            <div className="mt-8 text-center">
              <button
                onClick={() => dispatch({ type: 'SUBMIT_ANSWER' })}
                disabled={!canSubmit}
                className="px-8 py-2.5 bg-gray-800 text-white text-sm font-medium rounded-lg
                  hover:bg-gray-700 transition-colors cursor-pointer
                  disabled:bg-gray-300 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Check
              </button>
            </div>
          )}

          {/* Feedback */}
          {showingFeedback && lastAnswer && (
            <FeedbackCard
              isCorrect={lastAnswer.isCorrect}
              question={question}
              reinforcementShown={state.ui.reinforcementShown}
              onNext={() => dispatch({ type: 'CONTINUE_AFTER_FEEDBACK' })}
            />
          )}
        </div>
      </div>

      {/* On-demand strategy reference */}
      {showStrategies && (
        <StrategyReferencePanel
          growthItems={selectSkillGrowthSummary(state)}
          onClose={() => setShowStrategies(false)}
        />
      )}

      {/* Skill Growth / Strategy Review overlay */}
      {state.ui.showingSkillGrowth && (
        <SkillGrowthPanel
          data={selectCheckpointData(state)}
          onDismiss={() => dispatch({ type: 'DISMISS_SKILL_GROWTH' })}
          onRestart={() => {
            dispatch({ type: 'RESTART' });
            navigate('/');
          }}
        />
      )}
    </div>
  );
}
