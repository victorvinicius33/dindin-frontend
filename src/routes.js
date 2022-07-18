import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Main from './pages/Main';
import { getItem } from './utils/localStorage';

function ProtectedRoutes({ redirectTo }) {
  const isAuthenticated = getItem('token');

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
}

export default function MainRoutes() {
  return (
    <Routes>
      <Route path='/' element={<SignIn />} />
      <Route path='/sign-up' element={<SignUp />} />

      <Route element={<ProtectedRoutes redirectTo='/' />}>
        <Route path='/main' element={<Main />} />
      </Route>
    </Routes>
  );
}
