import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './store/auth-context';
import { RequireAuth, RedirectIfAuth } from './routes/guards';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Rentals from './pages/Rentals';
import RentalDetails from './pages/RentalDetails';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RedirectIfAuth />}>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route path='/' element={<Home />} />
            <Route path='/rentals' element={<Rentals />} />
            <Route path='/rentals/:id' element={<RentalDetails />} />
          </Route>

          <Route path='*' element={<RedirectIfAuth />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}