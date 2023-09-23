import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import API from '../services/api';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import urlImg from '../services/urlImg';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import Button from '@mui/material/Button';

import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import '../css/sidebar.css';
import WatchOutlinedIcon from '@mui/icons-material/WatchOutlined';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import DiscountOutlinedIcon from '@mui/icons-material/DiscountOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import ApartmentIcon from '@mui/icons-material/Apartment';


const SideBar = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const removeCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };
const handleLogout = () => {
    // Xóa token trong cookie
    removeCookie('tokenAdmin');

    // Tải lại trang
    window.location.reload();
};
  return (
    <div style={{ display: 'flex', backgroundColor: "#E2E2E2" }}>

      <Sidebar collapsed={sidebarCollapsed} style={{ height: '100vh', background: 'black' }}>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' , marginBottom:"30px"}}>
          <Link to={'/admin/home'}>
            <img
              src={urlImg + 'dlb-logo.png'}
              style={{ width: '70px', marginBottom: '26px' }}
              alt="imglogo"
            />
          </Link>
        </div>


        <Menu iconShape="square">

          {/* <SubMenu label={<h1 >Product Manager</h1>} icon={<CategoryIcon style={{ fontSize: '40px' }} />} style={{ minHeight: '70px', color: 'white' }}>

            <Link to="/admin/watch-management" style={{ textDecoration: 'none' }}>
              <MenuItem style={{ height: '100%', backgroundColor: 'black', minHeight: '60px' }} icon={<WatchOutlinedIcon style={{ fontSize: '40px', color: 'white' }} />}>
                <h1 style={{ color: 'white' }}>Watch</h1>
              </MenuItem>
            </Link>

            <Link to="/admin/order-management" style={{ textDecoration: 'none' }}>
              <MenuItem style={{ height: '100%', backgroundColor: 'black', minHeight: '60px' }} icon={<LocalOfferOutlinedIcon style={{ fontSize: '40px', color: 'white' }} />}>
                <h1 style={{ color: 'white' }}>Brand</h1>
              </MenuItem>
            </Link>

          </SubMenu> */}

          <Link to="/admin/home" style={{ textDecoration: 'none' }}>
            <MenuItem style={{ height: '100%', backgroundColor: 'black', minHeight: '60px' }} icon={<HomeOutlinedIcon style={{ fontSize: '40px', color: 'white' }} />}>
              <h1 style={{ color: 'white' , fontSize:"15px"}}>Home</h1>
            </MenuItem>
          </Link>
          <Link to="/admin/staff-management" style={{ textDecoration: 'none' }}>
            <MenuItem style={{ height: '100%', backgroundColor: 'black', minHeight: '60px' }} icon={<AccountBoxOutlinedIcon style={{ fontSize: '40px', color: 'white' }} />}>
              <h1 style={{ color: 'white' , fontSize:"15px"}}>Staff management</h1>
            </MenuItem>
          </Link>
          <Link to="/admin/watch-management" style={{ textDecoration: 'none' }}>
            <MenuItem style={{ height: '100%', backgroundColor: 'black', minHeight: '60px' }} icon={<WatchOutlinedIcon style={{ fontSize: '40px', color: 'white' }} />}>
              <h1 style={{ color: 'white'  , fontSize:"15px"}}>Watch management</h1>
            </MenuItem>
          </Link>

          <Link to="/admin/discount-management" style={{ textDecoration: 'none' }}>
            <MenuItem style={{ height: '100%', backgroundColor: 'black', minHeight: '60px' }} icon={<DiscountOutlinedIcon style={{ fontSize: '40px', color: 'white' }} />}>
              <h1 style={{ color: 'white' , fontSize:"15px" }}>Discount management</h1>
            </MenuItem>
          </Link>

          <Link to="/admin/supplier-management" style={{ textDecoration: 'none' }}>
            <MenuItem style={{ height: '100%', backgroundColor: 'black', minHeight: '60px' }} icon={<ApartmentIcon style={{ fontSize: '40px', color: 'white' }} />}>
              <h1 style={{ color: 'white' , fontSize:"15px" }}>Supplier management</h1>
            </MenuItem>
          </Link>


          <Link to="/admin/order-management" style={{ textDecoration: 'none' }}>
            <MenuItem style={{ height: '100%', minHeight: '70px' }} icon={<FactCheckIcon style={{ fontSize: '40px', color: 'white' }} />}>
              <h1 style={{ color: 'white' , fontSize:"15px" }}>Order management</h1>
            </MenuItem>
          </Link>

          <Link to="/admin/changepass" style={{ textDecoration: 'none' }}>
            <MenuItem style={{ height: '100%', minHeight: '70px' }} icon={<SettingsIcon style={{ fontSize: '40px', color: 'white' }} />}>
              <h1 style={{ color: 'white' , fontSize:"15px" }}>Change Password</h1>
            </MenuItem>
          </Link>

          <Link to="/admin/signin" style={{ textDecoration: 'none' }} onClick={handleLogout}>
            <MenuItem style={{ height: '100%', minHeight: '70px' }} icon={<LogoutIcon style={{ fontSize: '40px', color: 'white' }} />}>
              <h1 style={{ color: 'white' , fontSize:"15px" }}>Log out</h1>
            </MenuItem>
          </Link>

          

        </Menu>

      </Sidebar>

      <Card
        style={{
          marginRight: '10px',
          width: '40px', // Set the width of the card to your desired size
          height: '40px', // Set the height of the card to your desired size
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          marginLeft: '10px',
        }}
        onClick={toggleSidebar}
      >
        <MenuIcon />
      </Card>
      {/* <div style={{  display: 'flex', flexDirection: 'column' }}> */}
      {/* Your other page content goes here */}
      {children}
      {/* </div> */}
    </div >
  );
};

export default SideBar;
