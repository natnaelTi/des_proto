import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession, selectSkillGrowthSummary, selectProgress } from '../state/store';

export function SummaryPage() {
  const { state, dispatch } = useSession();
  const navigate = useNavigate();
  const items = selectSkillGrowthSummary(state);
  const progress = selectProgress(state);

  useEffect(() => {
    if (state.phase === 'start') navigate('/', { replace: true });
  }, [state.phase, navigate]);

  const handleRestart = () => {
    dispatch({ type: 'RESTART' });
    navigate('/');
  };

  const totalCorrect = state.history.filter((h) => h.isCorrect).length;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Workout Complete
        </h1>
        <p className="text-gray-500 mb-8">
          You answered {totalCorrect} of {progress.total} correctly.
        </p>

        {items.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-8 text-left">
            <h3 className="text-base font-semibold text-gray-800 mb-3">
              Skill Growth
            </h3>
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item.category}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                  {item.phrase}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleRestart}
          className="px-8 py-3 bg-gray-800 text-white font-medium rounded-lg
            hover:bg-gray-700 transition-colors cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Restart
        </button>
      </div>
    </div>
  );
}
