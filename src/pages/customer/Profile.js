import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import urlImg from "../../services/urlImg";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LogoutIcon from "@mui/icons-material/Logout";
import Swal from "sweetalert";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import getCookie from '../../utils/getCookie'; 
import "../../css/order.css";
const Profile = () => {
    const navigate = useNavigate(); // initialize navigate
    const [customer, setCustomer] = useState('');
    useEffect(() => {
        async function fetchData() {
            const token = getCookie("token");
            if (!token) {
                setCustomer(null);
                Swal({
                    title: "Please Login",
                    text: "",
                    icon: "error",
                    dangerMode: true,
                }).then(() => {
                    window.location.href = "/dlbwatchofficial/signin";
                });

                return;
            }
            try {
                const response = await API.get("/customer/getCusProfile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCustomer(response.data.customer);
            } catch (error) {
                console.log("Error:", error);
                setCustomer(null);
                Swal({
                    title: "Please Login",
                    text: "",
                    icon: "error",
                    dangerMode: true,
                }).then(() => {
                    window.location.href = "/dlbwatchofficial/signin";
                });
            }
        }
        fetchData();
    }, [navigate]);

    const handleProfileUpdate = async () => {
        const token = getCookie("token");
        if (!token) {
            setCustomer(null);
        }
        try {
            const customerData = { ...customer };
            delete customerData.password;
            const response = await API.put("/customer/updateProfile", customerData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            Swal({
                title: response.data.message,
                text: "",
                icon: "success",
                dangerMode: false,
            }).then(() => {
                window.location.reload();
            });
        } catch (error) {
            setCustomer(null);
            Swal({
                title: "Lỗi",
                text: error.response.data.message,
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
        removeCookie("token");

        // Tải lại trang
        window.location.reload();
    };

    function formatDateOfBirth(dateOfBirth) {
        const date = new Date(dateOfBirth);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    return (
        <div class="form_watchlist">
            <Header />
            <div id="user_container">
                <div class="container pIHdXn">
                    <div class="AmWkJQ">
                        <div class="kul4+s">
                            <div class="miwGmI">
                                {customer && (
                                    <div class="mC1Llc">{customer.Ho + " " + customer.Ten}</div>
                                )}
                                <div>
                                    <Link to="/account/profile" class="_78QHr1">
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 12 12"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48"
                                                fill="#9B9B9B"
                                                fill-rule="evenodd"
                                            ></path>
                                        </svg>
                                        Sửa hồ sơ
                                    </Link>
                                </div>
                            </div>

                            <div class="rhmIbk">
                                <div class="stardust-dropdown">
                                    <div class="stardust-dropdown__item-header">
                                        <Link to="/account/profile" class="+1U02e">
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
                                            <Link
                                                to="/account/profile"
                                                class="FEE-3D"
                                                style={{ color: "#C09E57" }}
                                            >
                                                <span class="qyt-aY">Profile</span>
                                            </Link>

                                            <Link to="/orders" class="FEE-3D">
                                            <span class="qyt-aY">The Orders</span>
                                            </Link>
                                            <Link to="/account/changepass" class="FEE-3D">
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
                        <div class="profile-container">
                            <h2 class="h2-profile">GENERAL INFORMATION</h2>
                            <div class="info-blockform">
                                <div className="inputname">
                                    <div className="firstname">
                                        <label class="label-account" htmlFor="firstName">
                                            First name
                                        </label>
                                        <input
                                            class="input-account"
                                            type="text"
                                            placeholder="Enter first name"
                                            id="firstName"
                                            value={customer?.Ten}
                                            onChange={(e) => setCustomer({ ...customer, Ten: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label class="label-account" htmlFor="lastName">
                                            Surname
                                        </label>
                                        <input
                                            class="input-account"
                                            type="text"
                                            placeholder="Enter surname"
                                            id="lastName"
                                            value={customer?.Ho}
                                            onChange={(e) => setCustomer({ ...customer, Ho: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="inputname">
                                    <div className="firstname">
                                        <label class="label-account" htmlFor="dateOfBirth">
                                            Date of birth
                                        </label>
                                        <input
                                            class="input-account"
                                            type="date"
                                            placeholder="Enter date of birth"
                                            id="dateOfBirth"
                                            value={formatDateOfBirth(customer?.NgaySinh)}
                                            onChange={(e) => setCustomer({ ...customer, NgaySinh: e.target.value })}
                                            required
                                        />

                                    </div>
                                    <Box sx={{ minWidth: 220 }}>
                                        <FormControl fullWidth>
                                            <InputLabel
                                                id="label-account"
                                                class="label-account"
                                                variant="standard"
                                                htmlFor="uncontrolled-native"
                                            >
                                                Gender
                                            </InputLabel>
                                            <NativeSelect
                                                value={customer?.GioiTinh}
                                                inputProps={{
                                                    name: 'gender',
                                                    id: 'uncontrolled-native',
                                                }}
                                                onChange={(e) => setCustomer({ ...customer, GioiTinh: e.target.value === "true" })}
                                            >
                                                <option value={false}>Female</option>
                                                <option value={true}>Male</option>
                                            </NativeSelect>
                                        </FormControl>
                                    </Box>
                                </div>
                                <div>
                                    <label class="label-account" htmlFor="address">
                                        Address
                                    </label>
                                    <input
                                        class="input-account"
                                        type="text"
                                        id="address"
                                        placeholder="Enter address"
                                        value={customer?.DiaChi}
                                        onChange={(e) => setCustomer({ ...customer, DiaChi: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label class="label-account" htmlFor="email">
                                        Email Address
                                    </label>
                                    <input
                                        class="input-account"
                                        type="email"
                                        placeholder="Email address"
                                        id="email"
                                        value={customer?.Email}
                                        onChange={(e) => setCustomer({ ...customer, Email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label class="label-account" htmlFor="phone">
                                        Mobile Phone Number
                                    </label>
                                    <input
                                        class="input-account"
                                        type="text"
                                        id="phone"
                                        placeholder="Mobile phone number"
                                        value={customer?.SDT}
                                        onChange={(e) => setCustomer({ ...customer, SDT: e.target.value })}
                                        required
                                    />
                                </div>

                                <div class="btn-access">
                                    <button
                                        class="button button-dark js_make_appointment_btn js_ma_watch_button"
                                        onClick={handleProfileUpdate}
                                    >
                                        SAVE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default Profile;
