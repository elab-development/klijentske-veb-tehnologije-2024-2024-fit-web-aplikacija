import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Planner from './pages/Planner';
import ExerciseExplorer from './pages/ExerciseExplorer';
import Journal from './pages/Journal';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/planner' element={<Planner />} />
          <Route path='/exercise-explorer' element={<ExerciseExplorer />} />
          <Route path='/journal' element={<Journal />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;