import '../../css/signin.css';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Swal from 'sweetalert2';

import API from '../../services/api';
import Header from '../../components/Header';

const Signin = () => {
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
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = { phoneOrEmail, password };
    API.post('/customer/signIn', data)
      .then((response) => {
        if (response.data.success) {
          Cookies.set('token', response.data.token);

          Swal.fire({ // Corrected Swal function name
            title: "Sign in success!",
            text: response.data.message,
            icon: "success",
            dangerMode: true,
          }).then(() => {

            const queryParams = new URLSearchParams(window.location.search);
            const redirectAfterLogin = queryParams.get("redirect");
            if (redirectAfterLogin) {
              window.location.href = "/dlbwatchofficial"+redirectAfterLogin;
            } else {
              // If there's no specific route to redirect, navigate to the home page
              window.location.href = "/dlbwatchofficial/home";
            }
          });
              
          setErrorMessage(response.data.customer.name);
        } else {
          setErrorMessage(response.data.message);
        }
      })
      .catch((error) => {
        // Xử lý lỗi ở đây
        if (error.response) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('Đã có lỗi xảy ra trong quá trình đăng nhập!');
        }
      });
  };

  return (
    <div class="form-account">
      <div class="header-color"></div>
      <Header />
      <div class="form">
        <div class="account-container" >
          <h1 class="h1-account">login to DLB store</h1>
          <p class="subtitle-container">Access your DLB Store account.</p>
        </div>
        <div class="profile">
          <div class="mw profile-container"  >
            <div class="info-blockform">
              <form onSubmit={handleSubmit}>
                {errorMessage && <div class="error">{errorMessage}</div>}

                <div>
                  <label class="label-account" htmlFor="phone">Phone/ Email Adress</label>
                  <input class="input-account" type="text" placeholder="Email adress/ Mobile phone number" id="phone" value={phoneOrEmail} onChange={handlePhoneOrEmailChange} required />
                </div>

                <div>
                  <label class="label-account" htmlFor="password">Password</label>
                  <div className="password-input-container">
                    <input class="input-account" type={showPassword ? 'text' : 'password'} placeholder="*******" id="password" value={password} onChange={handlePasswordChange} required />
                    {/* Icon ẩn/hiện password */}
                    {showPassword ? (
                      <VisibilityOffIcon onClick={handleShowPassword} />
                    ) : (
                      <VisibilityIcon onClick={handleShowPassword} />
                    )}
                  </div>

                </div>
                <div class="signinup-now">
                  <label class="label-acc">Don't have an account? </label><Link to="/signup" class="link-signinup-now">Sign Up Now</Link>
                </div>
                <div class="btn-access">
                  <button class="btn-account" type="submit" >Login</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Signin;
