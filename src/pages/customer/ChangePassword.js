import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from '../../services/api';
import urlImg from '../../services/urlImg';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LogoutIcon from '@mui/icons-material/Logout';
import Swal from 'sweetalert';

import '../../css/order.css';
import getCookie from '../../utils/getCookie'; 

const VerifyPass = () => {
    const navigate = useNavigate(); // initialize navigate
    const [customer, setCustomer] = useState('');
    const [verificationStatus, setVerificationStatus] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    useEffect(() => {
        async function fetchData() {

            const token = getCookie('token');
            if (!token) {
                setCustomer(null)
                Swal({
                    title: "Please Login",
                    text: "",
                    icon: "error",
                    dangerMode: true,
                }).then(() => {
                    window.location.href = '/dlbwatchofficial/signin';
                });

                return;
            }
            try {
                const response = await API.get('/customer/getCusProfile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCustomer(response.data.customer);

            } catch (error) {
                console.log('Error:', error);
                setCustomer(null);
                Swal({
                    title: "Please Login",
                    text: "",
                    icon: "error",
                    dangerMode: true,
                }).then(() => {
                    window.location.href = '/dlbwatchofficial/signin';
                });

            }

        }
        fetchData();
    }, [navigate]);
    
    const handleCheck = async (event) => {
        event.preventDefault();
        const passwordInput = document.getElementById('password');
        const password = passwordInput.value;

        try {
            const response = await API.post('/customer/signIn', {
                phoneOrEmail: customer.SDT,
                password: password
            });

            if (response.data.success) {
                setVerificationStatus(true);
                Swal({
                    title: "Password verification successful!",
                    text: "",
                    icon: "success",
                    dangerMode: true,
                });
            } else {
                Swal({
                    title: "Password verification failed!",
                    text: response.data.message,
                    icon: "error",
                    dangerMode: true,
                });
            }
        } catch (error) {
            Swal({
                title: "Error",
                text: "An error occurred while verifying the password!",
                icon: "error",
                dangerMode: true,
            });
        }
    };

    const handleProfileUpdate = async () => {
        const token = getCookie('token');
        if (!token) {
            setCustomer(null)
        }

        try {
            if (newPassword === '') {
                throw new Error("New Password is required");
              }

            if (newPassword !== confirmPassword) {
                throw new Error("New password and confirm password do not match");
            }

            const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
            if (specialChars.test(confirmPassword)) {
                throw new Error("New Password must not contain special characters");
              
            }
            const updatedCustomer = { ...customer, password: confirmPassword };

            const response = await API.put('/customer/updatePassword', updatedCustomer, {
                headers: { Authorization: `Bearer ${token}` },
            });

            Swal({
                title: "Change password successful",
                text: "",
                icon: "success",
                dangerMode: false,
            }).then(() => {
                window.location.href = '/dlbwatchofficial/orders';

            });
        } catch (error) {
            setCustomer(null);
            Swal({
                title: error.message,
                text: "",
                icon: "error",
                dangerMode: true,
            }).then(() => {
                window.location.reload();
            });
        }
    };

    const removeCookie = (name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      };
    const handleLogout = () => {
        // Xóa token trong cookie
        removeCookie('token');

        // Tải lại trang
        window.location.reload();
    };
    return (
        <div class="form_watchlist">
            <Header />
            <div id="user_container">
                <div class="container pIHdXn">
                    <div class="AmWkJQ">
                        <div class="kul4+s">
                            <div class="miwGmI">
                            {customer && <div class="mC1Llc">{customer.Ho+" "+customer.Ten}</div>}
                                <div>
                                    <Link to="/account/profile" class="_78QHr1">
                                        <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48" fill="#9B9B9B" fill-rule="evenodd"></path></svg>
                                        Sửa hồ sơ
                                    </Link></div></div>

                            <div class="rhmIbk">
                                <div class="stardust-dropdown">
                                    <div class="stardust-dropdown__item-header">
                                    <Link to="/account/profile" class="+1U02e" >
                                            <div class="bfikuD">
                                                <img src="https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4" />
                                            </div>
                                            <div class="DlL0zX">
                                                <span class="adF7Xs">My Account</span>
                                            </div>
                                        </Link>
                                    </div>
                                    <div class="stardust-dropdown__item-body">
                                        <div class="Yu7gVR">
                                            <Link to="/account/profile"  class="FEE-3D" >
                                                <span class="qyt-aY" >Profile</span>
                                            </Link>
                                            
                                            <Link to="/orders" class="FEE-3D" >
                                                <span class="qyt-aY">The Orders</span>
                                            </Link>
                                            <Link to="/account/changepass" class="FEE-3D" style={{ color: '#C09E57' }} >
                                                <span class="qyt-aY">Change Password</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div class="stardust-dropdown">
                                    <div class="stardust-dropdown__item-header">
                                        <a class="+1U02e" onClick={handleLogout}>
                                            <div class="bfikuD">
                                                <LogoutIcon />
                                            </div>
                                            <div class="DlL0zX">
                                                <span class="adF7Xs">Đăng Xuất</span>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="xMDeox">
                        <div class="profile-container" >
                        {verificationStatus ? (
                                <div>
                                    <h2 class="h2-profile">Change Password</h2>
                                    <div class="info-blockform">
                                        <div  >
                                            <label class="label-account" htmlFor="name">New Password</label>
                                            <input
                                                className="input-account"
                                                type="password"
                                                placeholder="New Password"
                                                id="newPassword"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />

                                        </div>
                                        <div>
                                            <label class="label-account" htmlFor="email">Confirm Password</label>
                                            <input
                                                className="input-account"
                                                type="password"
                                                placeholder="Confirm Password"
                                                id="confirmPassword"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div class="btn-access">
                                            <button class="button button-dark js_make_appointment_btn js_ma_watch_button" onClick={handleProfileUpdate}>SAVE</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h2 class="h2-profile">Verify your password</h2>
                                    <div class="info-blockform">
                                        <div>
                                            <label class="label-account" htmlFor="name">Old Password</label>
                                            <input class="input-account" type="password" placeholder="Enter old password" id="password" required />
                                        </div>
                                        <div class="btn-access">
                                            <button class="button button-dark js_make_appointment_btn js_ma_watch_button" onClick={handleCheck} >CHECK</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                <Footer />

            </div>
        </div>
    );
};

export default VerifyPass;