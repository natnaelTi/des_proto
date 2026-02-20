import type { CheckpointData } from '../state/types';

interface SkillGrowthPanelProps {
  data: CheckpointData;
  onDismiss: () => void;
  onRestart: () => void;
}

export function SkillGrowthPanel({
  data,
  onDismiss,
  onRestart,
}: SkillGrowthPanelProps) {
  const isStrategy = data.mode === 'strategy';
  const showRestart = isStrategy && data.isEndOfSession;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {isStrategy ? 'Quick Review' : 'Skill Growth'}
        </h3>

        {isStrategy ? (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Here are some strategies that can help:
            </p>
            <ul className="space-y-3 mb-5">
              {data.strategyTips.map((tip) => (
                <li key={tip.category} className="text-sm text-gray-700">
                  <span className="font-medium text-gray-800">
                    {tip.displayName[0].toUpperCase() +
                      tip.displayName.slice(1)}
                  </span>
                  <p className="mt-0.5 text-gray-600">{tip.strategyLine}</p>
                </li>
              ))}
            </ul>
          </>
        ) : data.growthItems.length === 0 ? (
          <p className="text-sm text-gray-500 mb-4">
            Keep going — your progress will show here.
          </p>
        ) : (
          <ul className="space-y-2 mb-5">
            {data.growthItems.map((item) => (
              <li
                key={item.category}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                {item.phrase}
              </li>
            ))}
          </ul>
        )}

        {showRestart ? (
          <div className="flex gap-3">
            <button
              onClick={onRestart}
              className="flex-1 px-5 py-2.5 bg-gray-800 text-white text-sm font-medium rounded-lg
                hover:bg-gray-700 transition-colors cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        ) : (
          <button
            onClick={onDismiss}
            className="w-full px-5 py-2.5 bg-gray-800 text-white text-sm font-medium rounded-lg
              hover:bg-gray-700 transition-colors cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
