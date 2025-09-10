import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import Planner from './pages/Planner';
import ExerciseExplorer from './pages/ExerciseExplorer';
import Journal from './pages/Journal';
import Insights from './pages/Insights';

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/planner' element={<Planner />} />
          <Route path='/exercises' element={<ExerciseExplorer />} />
          <Route path='/journal' element={<Journal />} />
          <Route path='/insights' element={<Insights />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;