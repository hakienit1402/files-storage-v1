import {
  Box,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List
} from '@material-ui/core';
import InputIcon from '@material-ui/icons/Input';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import {
  BarChart as BarChartIcon,
  Users as UsersIcon
} from 'react-feather';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { useLocation,useNavigate} from 'react-router-dom';
import NavItem from './NavItem';

const items = [
  {
    href: '/admin/dashboard',
    icon: BarChartIcon,
    title: 'Thống kê'
  },
  {
    href: '/admin/customers',
    icon: UsersIcon,
    title: 'Thành viên'
  },
  {
    href: '/admin/revenue',
    icon: AttachMoneyIcon,
    title: 'Doanh thu'
  },

];

const DashboardSidebar = ({ onMobileClose, openMobile }) => {
  const location = useLocation();
  const navigate = useNavigate(); 
  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);
  const handleLogout = () => {
    localStorage.removeItem('isAuthen')
    navigate('/admin/login', { replace: true });
    window.location.reload()
  }
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Divider />
      <Box sx={{ p: 2 }}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );
  const mobileContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
       <Box sx={{ p: 2 }}>
   
   <NavItem
     href ='/admin/dashboard'
     key ='home'
     title ='ADMINSTRATOR'
     icon = {UsersIcon}
   />

</Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 3 }} style={{display:'flex',justifyContent:'center'}}>
           <InputIcon  onClick={handleLogout} style={{cursor:'pointer'}}/>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            sx: {
              width: 256
            }
          }}
        >
          {mobileContent}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: 256,
              top: 64,
              height: 'calc(100% - 64px)'
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

DashboardSidebar.defaultProps = {
  onMobileClose: () => { },
  openMobile: false
};

export default DashboardSidebar;
