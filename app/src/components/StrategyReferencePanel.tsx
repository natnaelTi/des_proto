import type { SkillGrowthItem } from '../state/types';
import { ALL_CATEGORIES, CATEGORY_DISPLAY_NAMES, STRATEGY_LINES } from '../state/types';

interface StrategyReferencePanelProps {
  growthItems: SkillGrowthItem[];
  onClose: () => void;
}

export function StrategyReferencePanel({
  growthItems,
  onClose,
}: StrategyReferencePanelProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6 max-w-sm w-full mx-4 max-h-[80dvh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Strategies
        </h3>

        <ul className="space-y-3 mb-5">
          {ALL_CATEGORIES.map((cat) => (
            <li key={cat} className="text-sm text-gray-700">
              <span className="font-medium text-gray-800">
                {CATEGORY_DISPLAY_NAMES[cat][0].toUpperCase() +
                  CATEGORY_DISPLAY_NAMES[cat].slice(1)}
              </span>
              <p className="mt-0.5 text-gray-600">{STRATEGY_LINES[cat]}</p>
            </li>
          ))}
        </ul>

        {growthItems.length > 0 && (
          <>
            <div className="border-t border-gray-100 pt-4 mt-4 mb-3">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                Your Progress
              </h4>
              <ul className="space-y-2">
                {growthItems.map((item) => (
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
          </>
        )}

        <button
          onClick={onClose}
          className="w-full mt-2 px-5 py-2.5 bg-gray-800 text-white text-sm font-medium rounded-lg
            hover:bg-gray-700 transition-colors cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Close
        </button>
      </div>
    </div>
  );
}
