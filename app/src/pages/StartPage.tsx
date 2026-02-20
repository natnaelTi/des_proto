import { useNavigate } from 'react-router-dom';
import { useSession } from '../state/store';

export function StartPage() {
  const { dispatch } = useSession();
  const navigate = useNavigate();

  const handleStart = () => {
    dispatch({ type: 'START_SESSION' });
    navigate('/workout');
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50 px-4 sm:px-6">
      <div className="text-center max-w-md w-full">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-3">
          Fraction Comparison Workout
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mb-8">
          A short workout to sharpen your fraction comparison skills.
        </p>
        <button
          onClick={handleStart}
          className="px-8 py-3 bg-gray-800 text-white font-medium rounded-lg
            hover:bg-gray-700 transition-colors cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Start Workout
        </button>
      </div>
    </div>
  );
}
