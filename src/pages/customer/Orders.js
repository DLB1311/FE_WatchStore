import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from '../../services/api';
import urlImg from '../../services/urlImg';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../css/watchlist.css';
import '../../css/order.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import '../../css/cart.css';
import '../../css/home.css';
// import Swal from 'sweetalert';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import getOrderStatusText from "../../utils/orderUtils";
import getCookie from '../../utils/getCookie';
import Button from '@mui/material/Button';

const Order = () => {

    const navigate = useNavigate(); // initialize navigate

    const [customer, setCustomer] = useState('');
    const [orders, setOrders] = useState([]);
    const [statusFilters, setStatusFilters] = useState([]);

    async function fetchData() {
        const token = getCookie('token');
        if (!token) {
            setCustomer(null);
            Swal.fire({
                title: 'Please Login',
                icon: 'error',
                showCancelButton: true,
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/dlbwatchofficial/signin';
                } else {
                    window.location.href = '/dlbwatchofficial/home';
                }
            });
            return;
        }

        try {
            const response = await API.get('/customer/getCusProfile', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCustomer(response.data.customer);

            const userOrders = await getUserOrders(token);
            setOrders(userOrders);
        } catch (error) {
            console.log('Error:', error);
            setCustomer(null);
            setOrders([]);
        }
    }

    useEffect(() => {
        fetchData();
    }, [navigate]); 



    const handleCancelOrder = async (orderId) => {
        try {
            const token = getCookie("token");
            if (!token) {
                // Handle the case where the user is not logged in
                // This should not happen because the cancel button should not be visible for non-logged-in users
                return;
            }

            const response = await API.post(
                "/customer/cancelOrder",
                { orderId },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                // Order canceled successfully, update the state to remove the canceled order from the list
                setOrders((prevOrders) =>
                    prevOrders.filter((order) => order.MaPD !== orderId)
                );

                // Show a success message to the user using your preferred method (e.g., Swal)
                Swal.fire({
                    title: "Order Canceled",
                    text: "Your order has been canceled successfully.",
                    icon: "success",
                }).then(() => {
                    fetchData();
                  });

            } else {
                // Show an error message to the user using your preferred method (e.g., Swal)
                Swal.fire({
                    title: "Error",
                    text: "An error occurred while canceling the order.",
                    icon: "error",
                });
            }
        } catch (error) {
            console.log("Error:", error);
            // Show an error message to the user using your preferred method (e.g., Swal)
            Swal.fire({
                title: "Error",
                text: "An error occurred while canceling the order.",
                icon: "error",
            });
        }
    };


    const getUserOrders = async (token) => {
        try {
            const response = await API.get('/customer/getOrdersByCustomerId', {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data.orders;
        } catch (error) {
            console.log('Error:', error);
            return [];
        }
    };

    const calculateTotalAmount = (order) => {
        let total = 0;
        order.ChiTietPD.forEach((item) => {
            total += item.SoLuong * item.DonGia;
        });
        return total;
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

    const handleCheckboxChange = (event) => {
        const statusValue = parseInt(event.target.value);
        setStatusFilters((prevFilters) => {
            if (event.target.checked) {
                return [...prevFilters, statusValue];
            } else {
                return prevFilters.filter((filter) => filter !== statusValue);
            }
        });
    };

    return (
        <div class="form_watchlist">
            <Header />
            <div id="user_container">
                <div class="container pIHdXn">
                    <div class="AmWkJQ">
                        <div class="kul4+s">
                            <div class="miwGmI">
                                {customer && <div class="mC1Llc">{customer.Ho + " " + customer.Ten}</div>}
                                <div>
                                    <Link to="/account/profile" class="_78QHr1" >
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
                                            <Link to="/account/profile" class="FEE-3D" >
                                                <span class="qyt-aY" >Profile</span>
                                            </Link>

                                            <Link to="/order" class="FEE-3D" style={{ color: '#C09E57' }} >
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
                    {orders.length > 0 ? (
                        <>
                            <div class="xMDeox">
                                <div class="filter-status-buttons">
                                    {[0, 1, 2, 3, 4].map((status) => (
                                        <Button
                                            key={status}
                                            variant="contained"
                                            style={{
                                                backgroundColor: statusFilters.includes(status) ? "black" : "white",
                                                color: statusFilters.includes(status) ? "white" : "black",
                                                margin: "5px",
                                            }}
                                            onClick={() => handleCheckboxChange({ target: { value: status, checked: !statusFilters.includes(status) } })}
                                        >
                                            {getOrderStatusText(status)}
                                        </Button>
                                    ))}
                                </div>
                                {orders
                                    .filter((order) => statusFilters.length === 0 || statusFilters.includes(order.TrangThai))
                                    .map((order) => (
                                    <div key={orders._id} class="--tO6n">
                                        <div class="hiXKxx">

                                            <div class="x0QT2k">

                                                <div class="V+w7Xs">
                                                    <div>{new Date(order.NgayDat).toISOString().split('T')[0]}</div>
                                                    <div>
                                                        {getOrderStatusText(order.TrangThai)}
                                                    </div>

                                                </div>

                                                {order.ChiTietPD.map((item) => (
                                                    <div class="_0OiaZ-">
                                                        <div class="FbLutl">
                                                            <div>
                                                                <span class="x7nENX">
                                                                    <div></div>
                                                                    <div class="aybVBK">
                                                                        <div class="rGP9Yd">
                                                                            <div class="shopee-image__wrapper">
                                                                                <div class="shopee-image__content">
                                                                                    <img src={urlImg + item.HinhAnh} alt={item.TenDH} />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="_7uZf6Q">
                                                                            <div class="iJlxsT"><span class="x5GTyN">{item.TenDH}</span></div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="_9UJGhr">
                                                                        <div class="_3F1-5M">x{item.SoLuong}</div>
                                                                        <span class="-x3Dqh OkfGBc">{item.DonGia.toLocaleString()} VND</span>
                                                                    </div>
                                                                </span>
                                                                <div class="Cde7Oe"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div class="O2KPzo">
                                                <div class="mn7INg xFSVYg" />
                                                <div class="mn7INg EfbgJE" />
                                            </div>
                                            <div class="kvXy0c">
                                                <div class="-78s2g">
                                                    <div class="_0NMXyN">Total Amount:</div>
                                                    <div class="DeWpya">${calculateTotalAmount(order).toLocaleString()} VND</div>
                                                </div>

                                                <div class="mn7INg EfbgJE"> </div>
                                            </div>
                                            <div class="AM4Cxf">
                                                {order.TrangThai === 0 && (
                                                    <div class="EOjXew">

                                                        <button class="button button-dark js_make_appointment_btn js_ma_watch_button" onClick={() => handleCancelOrder(order.MaPD)}>Cancel</button>


                                                        <Link to={`/paymentpage?id=${order.MaPD}`} class="cl-subcollections__button button">
                                                            Pay now
                                                        </Link>

                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>


                        </>
                    ) : (
                        <div className="sec bd-t-gry-1">
                            <div className="sec-inr pt-none">
                                <div className="cart-empty">
                                    <h1>You still don't have anything on your orders list</h1>

                                </div>
                                <div class="pd_hero__cta">
                                    <div class="pd_hero__make_appointment">
                                        <Link to={`/watchlist`} type="button" class="button button-dark js_make_appointment_btn js_ma_watch_button" >
                                            VIEW ALL WATCHES
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                <Footer />

            </div>
        </div>
    );
};

export default Order;