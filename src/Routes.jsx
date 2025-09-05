import { lazy } from 'react';

const UserListPage = lazy(() => import('./components/users/UserListPage'));
const Login = lazy(() => import('./pages/Auth'));
const Register = lazy(() => import('./components/Register'));

const routes = [
    { path: '/', element: <Login /> },
    { path: '/userListPage', element: <UserListPage /> },
    { path: '/register', element: <Register /> }
];

export default routes