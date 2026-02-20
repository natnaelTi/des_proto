export function MinimalNumberLine() {
  return (
    <div className="mt-3 px-2">
      <div className="relative h-8 flex items-center">
        <div className="w-full h-px bg-gray-300" />
        {/* 0 mark */}
        <div className="absolute left-0 flex flex-col items-center -translate-x-1/2">
          <div className="w-px h-3 bg-gray-400" />
          <span className="text-xs text-gray-400 mt-0.5">0</span>
        </div>
        {/* 1/2 mark */}
        <div className="absolute left-1/2 flex flex-col items-center -translate-x-1/2">
          <div className="w-px h-4 bg-gray-600" />
          <span className="text-xs font-medium text-gray-600 mt-0.5">½</span>
        </div>
        {/* 1 mark */}
        <div className="absolute right-0 flex flex-col items-center translate-x-1/2">
          <div className="w-px h-3 bg-gray-400" />
          <span className="text-xs text-gray-400 mt-0.5">1</span>
        </div>
      </div>
    </div>
  );
}
