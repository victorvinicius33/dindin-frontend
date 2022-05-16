import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Main from './pages/Main';
import AdicionarRegistro from './components/AdicionarRegistro';
import { getItem } from './utils/localStorage';

function ProtectedRoutes({ redirectTo }) {
    const isAuthenticated = getItem('token');

    return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
}

export default function Rotas() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/sign-up" element={<Cadastro />} />

            <Route element={<ProtectedRoutes redirectTo={'/'} />}>
                <Route path='/main' element={<Main />} />
            </Route>
        </Routes>
    )
}