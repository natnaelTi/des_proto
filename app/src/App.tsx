import { useReducer } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { reducer, createInitialState, SessionContext } from './state/store';
import { StartPage } from './pages/StartPage';
import { WorkoutPage } from './pages/WorkoutPage';
import { SummaryPage } from './pages/SummaryPage';

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/workout" element={<WorkoutPage />} />
          <Route path="/summary" element={<SummaryPage />} />
        </Routes>
      </BrowserRouter>
    </SessionContext.Provider>
  );
}
