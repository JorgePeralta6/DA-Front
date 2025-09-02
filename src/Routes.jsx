import { lazy } from 'react';

const UserListPage = lazy(() => import('./components/users/UserListPage'));

const routes = [
    { path: '/', element: <UserListPage /> }
];


export default routes