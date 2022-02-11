import 'react-perfect-scrollbar/dist/css/styles.css';
import { useRoutes,Routes,Route,Navigate } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import DashboardLayout from './components/DashboardLayout';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Revenue from './pages/Revenue';
import CustomerList from './pages/CustomerList';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import { useState } from 'react';

const App = () => {
  const routing = useRoutes(routes);
  // const auth = false;
  const [isAuth, setIsAuth] = useState(
    JSON.parse(localStorage.getItem("isAuthen"))
  );
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {/* {routing} */}
      {isAuth ? 
      <Routes>   
        <Route path='admin' element={<DashboardLayout />}>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/revenue' element={<Revenue />}/>
          <Route path='/customers' element={<CustomerList />}/>
          <Route path='*' element={<Navigate to="admin/dashboard" />}/>
        </Route>
        <Route path='404' element={<NotFound/>}/>
        <Route path='/' element={<Navigate to="admin/dashboard" />}/>
        <Route path='*' element={<Navigate to="admin/dashboard" />}/>
      </Routes>
      : 
      <Routes>
        <Route path='admin' element={<MainLayout />}>
          <Route path='/login' element={<Login/>}/>
          <Route path='*' element={<Navigate to="/admin/login"/>}/>
        </Route>
        <Route path='404' element={<NotFound/>}/>
        <Route path='/' element={<Navigate to="/admin/login"/>}/>
        <Route path='*' element={<Navigate to="/admin/login"/>}/>
      </Routes>
      }
    </ThemeProvider>
  );
};

export default App;
