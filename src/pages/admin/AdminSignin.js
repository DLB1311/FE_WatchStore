
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Swal from 'sweetalert2';
import API from '../../services/api';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import urlImg from "../../services/urlImg";

import '../../css/adminsignin.css';

const AdminSignin = () => {
    const [phoneOrEmail, setPhoneOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handlePhoneOrEmailChange = (event) => {
        setPhoneOrEmail(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = { phoneOrEmail, password };
        try {
          const response = await API.post('staff/signInAdmin', data)
    
          // Check if the login was successful
          if (response.data.success) {
            // Save the token in cookies or local storage (e.g., using js-cookie)
            const token = response.data.token;
            const role = response.data.customer.MaQuyen;
            Cookies.set('tokenAdmin', token);
              if(role === "NV"){
                  window.location.href = '/dlbwatchofficial/admin/home';
              }else if(role === "GH"){
                window.location.href = '/dlbwatchofficial/admin/shipper';
              }
            
    
          } else {
            // Show an error message if login fails
            setErrorMessage(response.data.message );
          }
        } catch (error) {
          console.error(error);
          setErrorMessage(error.response.data.message);
        }
      };


    return (
        <div class="form-account-admin">
            <div class="header-color"></div>
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Card variant="outlined" style={{ borderRadius: 16,background: 'rgba(0,0,0,0.8)', color: 'white' }}>
            <CardContent>
            <div class="form" style={{width:'450px'}}>
                <div class="account-container" >
                    <img src={urlImg + "dlb-logo.png"} style={{width:'50px', marginBottom:'26px'}}  alt="imglogo"/>
                    <h1 class="h1-account">Sign in</h1>
                    <p class="subtitle-container" style={{marginBottom:'76px'}}/>
                </div>
                <div class="profile">
                    <div class="mw profile-container"  >
                        <div class="info-blockform">
                            <form onSubmit={handleSubmit}>
                                {errorMessage && <div class="error">{errorMessage}</div>}
                                <div>
                  <label class="label-account" htmlFor="phone" style={{color:'white'}}>Phone/ Email Adress</label>
                  <input class="input-account" type="text" style={{color:'white'}} placeholder="Email adress/ Mobile phone number" id="phone" value={phoneOrEmail} onChange={handlePhoneOrEmailChange} required />
                </div>

                <div>
                  <label class="label-account" htmlFor="password" style={{color:'white'}}>Password</label>
                  <div className="password-input-container" >
                    <input class="input-account" style={{color:'white'}} type={showPassword ? 'text' : 'password'} placeholder="*******" id="password" value={password} onChange={handlePasswordChange} required />
                    {/* Icon ẩn/hiện password */}
                    {showPassword ? (
                      <VisibilityOffIcon onClick={handleShowPassword} style={{color:'white' }} />
                    ) : (
                      <VisibilityIcon onClick={handleShowPassword} style={{color:'white'}} />
                    )}
                  </div>

                </div>

                                <div class="btn-access">
                                    <button class="btn-account" type="submit" >Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            </CardContent>
        
            </Card>
            </Box>

        </div>
    );
};

export default AdminSignin;
