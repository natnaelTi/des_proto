import type { Fraction, Choice } from '../state/types';

interface FractionOptionCardProps {
  label: Choice;
  fraction: Fraction;
  selected: boolean;
  disabled: boolean;
  correctHighlight?: 'correct' | 'incorrect' | null;
  onSelect: () => void;
}

export function FractionOptionCard({
  label,
  fraction,
  selected,
  disabled,
  correctHighlight,
  onSelect,
}: FractionOptionCardProps) {
  let borderColor = 'border-gray-200';
  let bg = 'bg-white';

  if (correctHighlight === 'correct') {
    borderColor = 'border-emerald-400';
    bg = 'bg-emerald-50';
  } else if (correctHighlight === 'incorrect') {
    borderColor = 'border-gray-300';
    bg = 'bg-gray-50';
  } else if (selected) {
    borderColor = 'border-gray-500';
    bg = 'bg-gray-50';
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center rounded-xl border-2 px-8 py-6
        transition-all duration-150 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
        disabled:cursor-default
        ${borderColor} ${bg}
      `}
    >
      <span className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex flex-col items-center leading-none">
        <span className="text-3xl font-semibold text-gray-800">
          {fraction.n}
        </span>
        <div className="w-8 h-px bg-gray-800 my-1" />
        <span className="text-3xl font-semibold text-gray-800">
          {fraction.d}
        </span>
      </div>
    </button>
  );
}
