import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/components/DashboardLayout';
import MainLayout from 'src/components/MainLayout';
import CustomerList from 'src/pages/CustomerList';
import Dashboard from 'src/pages/Dashboard';
import Login from 'src/pages/Login';
import NotFound from 'src/pages/NotFound';
import Revenue from './pages/Revenue';

const routes = [
  {
    path: 'admin',
    element: <DashboardLayout />,
    children: [
      { path: 'customers', element: <CustomerList /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'revenue', element: <Revenue /> },
      { path: 'login', element: <Login /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/admin/login', element: <Login /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/admin/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
