import type { SkillGrowthItem } from '../state/types';

interface SkillGrowthPanelProps {
  items: SkillGrowthItem[];
  onDismiss: () => void;
}

export function SkillGrowthPanel({ items, onDismiss }: SkillGrowthPanelProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Skill Growth
        </h3>
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 mb-4">
            Keep going — your progress will show here.
          </p>
        ) : (
          <ul className="space-y-2 mb-5">
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
        )}
        <button
          onClick={onDismiss}
          className="w-full px-5 py-2.5 bg-gray-800 text-white text-sm font-medium rounded-lg
            hover:bg-gray-700 transition-colors cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
