interface ProgressBarProps {
  currentIndex: number;
  totalQuestions: number;
}

export function ProgressBar({ currentIndex, totalQuestions }: ProgressBarProps) {
  const pct = Math.min((currentIndex / totalQuestions) * 100, 100);

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm text-gray-500 whitespace-nowrap tabular-nums">
        Question {currentIndex} of {totalQuestions}
      </span>
    </div>
  );
}
