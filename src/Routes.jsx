import { lazy } from 'react';
import PrivateRoute from './components/PrivateRoute';

const UserListPage = lazy(() => import('./components/users/UserListPage'));
const Login = lazy(() => import('./pages/Auth'));
const Register = lazy(() => import('./components/Register'));
const UnauthorizedModal = lazy(() => import('./components/UnauthorizedModal'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const DashboardRedirect = lazy(() => import('./components/DashboardRedirect'));

const routes = [
  // Rutas públicas
  { path: '/', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/unauthorized', element: <UnauthorizedModal /> },

  // ✅ Ruta de redirección después del login
  {
    path: '/dashboard',
    element: <PrivateRoute allowedRoles={['EMPLOYEE_ROLE', 'ADMIN_ROLE']} />,
    children: [{ path: '', element: <DashboardRedirect /> }]
  },

  // ✅ Ruta para empleados (y opcionalmente admins también pueden ver usuarios)
  {
    path: '/userListPage',
    element: <PrivateRoute allowedRoles={['EMPLOYEE_ROLE', 'ADMIN_ROLE']} />, 
    children: [{ path: '', element: <UserListPage /> }]
  },

  // ✅ Ruta SOLO para admins
  {
    path: '/adminDashboard',
    element: <PrivateRoute allowedRoles={['ADMIN_ROLE']} />,
    children: [{ path: '', element: <AdminDashboard /> }]
  }
];

export default routes;