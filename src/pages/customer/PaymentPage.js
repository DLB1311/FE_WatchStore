import React, { useEffect, useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import API from "../../services/api";
import urlImg from "../../services/urlImg";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../css/payment.css";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import getOrderStatusText from "../../utils/orderUtils";
import getCookie from '../../utils/getCookie'; 
import formatDateTime from '../../utils/formatDateTime'; 


const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("id");
  const [cartItems, setCartItems] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);



  useEffect(() => {
    const handlePaymentCallback = async () => {
      const queryParams = new URLSearchParams(location.search);
      const transactionStatus = queryParams.get("vnp_TransactionStatus");
      const transactionNo = queryParams.get("vnp_TransactionNo");
      const orderId = queryParams.get("vnp_TxnRef");
      console.log(transactionStatus);
      console.log(transactionNo);
      console.log(orderId);

      if (transactionStatus && transactionNo && orderId) {
        if (transactionStatus !== "00") {
          // Transaction failed, show an error message or perform any other actions
          Swal.fire({
            icon: "error",
            title: "Transaction Failed",
            text: "The payment transaction was not successful.",
          });
          navigate(`/orders`);

        } else {
          // Transaction successful, call API to save the transaction number
          try {
            const token = getCookie("token");
            if (token) {
              const response = await API.put(
                "/payment/saveTransactionNumber",
                {
                  transactionNo,
                  orderId,
                },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (response && response.data && response.data.success) {
                // Transaction number saved successfully
                Swal.fire({
                  icon: "success",
                  title: "Payment Successful",
                  text: "Transaction number saved successfully.",
                });
                navigate(`/orders`);
              } else {
                // Handle error if the API call fails or the transaction number is not saved
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: "Failed to save the transaction number.",
                });
                navigate(`/orders`);
              }
            } else {

            }
          } catch (error) {
            // Handle API call errors or other errors
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "An error occurred while processing the payment.",
            });

          }
        }
      } else {

      }
    };

    handlePaymentCallback();
  }, [location]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      
      const token = getCookie("token");
      if (!token) {
        return;
      }
      try {

        const response = await API.get(`/customer/getOrderById/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response && response.data && response.data.success) {
          const orderDetails = response.data.orderDetails;
          setOrderInfo(orderDetails); 
          setCartItems(orderDetails.ChiTietPD);
        } else {
          // Handle error if the API call fails
        }
      } catch (error) {
        // Handle any API call errors
      }
    };

    fetchOrderDetails();
  }, [orderId]);




  const calculateTotalAmount = () => {
    let totalAmount = 0;
    if (cartItems.length > 0) {
      for (const item of cartItems) {
        totalAmount += item.DonGia * item.SoLuong;
      }
    }
    return totalAmount;
  };

  const [paymentUrl, setPaymentUrl] = useState("");

const handlePayNow = async () => {
        const token = getCookie("token");
        if (!token || !orderInfo || !orderInfo.MaPD) {
            // Handle error cases where token is not available or order information is missing
            return;
        }
        try {
            // Call the backend API to create the payment URL
            const response = await API.post(
                "/payment/create_payment_url",
                {
                    amount: calculateTotalAmount(),
                    MaPD: orderInfo.MaPD, // Total amount to be paid
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // Redirect to VNPay payment gateway
            if (response && response.data && response.data.url) {
                window.location.href = response.data.url;
            } else {
                // Handle error if the API call fails or the URL is not received
                // You can show an error message or take appropriate actions here
            }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
          });
        }
};



  return (
    <div className="form_watchlist">
      <Header />
      <div id="watchlist_container">
        <div id="maincontent" className="page-main contents">
          <div className="main main-s">
            <div className="profile">
              <div className="profile-container">
                <div className="title-order-info">
                  <h1 className="">Order Information</h1>
                  {orderInfo && (
                  <h1 className="status-txt">{getOrderStatusText(orderInfo.TrangThai)}</h1>
                  )}
                </div>
                

                <div className="info-blockform">
                {orderInfo && (
            <>
                <div className="inputname">
                    <div className="firstname">
                      <label className="label-account" htmlFor="firstName">
                        Order date
                      </label>
                      <h1 className="input-account"  >
                        {formatDateTime(orderInfo.NgayDat)}
                      </h1>
                    </div>
                    <div>
                      <h2 className="label-account" htmlFor="lastName">
                        Order id
                      </h2>
                      <h1 className="input-account"  >
                        {orderInfo.MaPD}
                      </h1>
                    </div>
                  </div>

                  <div className="inputname">
                    <div className="firstname">
                      <label className="label-account" htmlFor="firstName">
                        First name
                      </label>
                      <h1 className="input-account"  >
                        {orderInfo.TenNN}
                      </h1>
                    </div>
                    <div>
                      <h2 className="label-account" htmlFor="lastName">
                        Surname
                      </h2>
                      <h1 className="input-account"  >
                        {orderInfo.HoNN}
                      </h1>
                    </div>
                  </div>
                  <div>
                    <label className="label-account" htmlFor="address">
                      Address
                    </label>
                    <h1 className="input-account"  >
                        {orderInfo.DiaChiNN}
                      </h1>
                  </div>
                  <div>
                    <label className="label-account" htmlFor="phone">
                      Mobile Phone Number
                    </label>
                    <h1 className="input-account"  >
                        {orderInfo.SDT}
                      </h1>
                  </div>
                  </>
          )}
                </div>
                
              </div>
              
            </div>

            <div className="sec bd-t-gry-1">
              <div className="sec-inr pt-none">
                <form id="form-validate" className="form form-cart">
                  <div
                    id="shopping-cart-table"
                    className="cart items data table table-wrapper"
                  >
                    <div className="dataItem mybag-dataItem">
                      {cartItems.map((item) => (
                        <div
                          key={item.TenDH}
                          className="dataItem-inr dataItem-2col"
                        >
                          <div className="dataItem-img">
                            <img
                              className="product-image-photo"
                              src={urlImg + item.HinhAnh}
                              alt={item.TenDH}
                              loading="lazy"
                              width="110"
                              height="160"
                              alt=" "
                            />
                          </div>
                          <div className="dataItem-txt">
                            <div className="col title">
                              <div className="dataItem-header dataItem-header-2col">
                                <div className="dataItem-header-col cart_productname_wrapper">
                                  <h2 className="dataItem-title">
                                    <span className="is-category casio_us">
                                      {item.TenDH}
                                    </span>
                                  </h2>
                                  <div className="dataItem-header-col cart_price_wrapper">
                                    <p className="ta-r-pc is-price">
                                      <span
                                        className="price-excluding-tax"
                                        data-label="Excl. Tax"
                                      >
                                        <span className="cart-price">
                                          {item.DonGia.toLocaleString()} VND
                                        </span>
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="dataItem-txt w-100-sp qty_delete_container">
                              <div className="col">
                                <div className="dataItem-header dataItem-header-2col">
                                  <div className="dataItem-header-col clear-both">
                                    <div className="dataItem-amount is-amount-with-ui qty_wrapper">
                                      <input
                                        id={`cart-${item.TenDH}-qty`}
                                        className="dataItem-amount-input is-amount input-text qty aaaa"
                                        aria-label="Quantity"
                                        value={item.SoLuong}
                                        readOnly
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col dataItem-option"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="sec-inr pt-none">
              <div className="dataItem dataItem-accounting bd-t-gry-1">
                <div className="dataItem-inr dataItem-accounting-inr dataItem-2col">
                  <h2 className="title-2">Order Summary</h2>
                  <div className="dataItem-txt w-100-sp">
                    <div className="col"></div>{" "}
                    <div className="col">
                      <div
                        id="bottom-cart-totals"
                        className="cart-totals"
                        data-bind="scope:'block-totals'"
                      >
                        <div
                          className="table-wrapper"
                          data-bind="blockLoader: isLoading"
                        ></div>
                      </div>
                    </div>
                    <div
                      className="col col-total"
                      id="bottom-cart-grand-totals"
                      data-bind="scope:'bottom-grand-total'"
                    >
                      <div className="col col-total">
                        <table className="dataItem-table dataItem-table-price dataItem-table-total">
                          <tbody>
                            <tr>
                              <th className="dataItem-th">Estimated Total:</th>
                              <td
                                className="dataItem-td"
                                data-th="Total Amount"
                              >
                                <span data-bind="text: getValue()">
                                  {calculateTotalAmount().toLocaleString()} VND
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pd_hero__cta">
              <div className="pd_hero__make_appointment">
                <button
                  type="button"
                  className="button button-dark pd_hero__make_appointment_btn js_make_appointment_btn js_ma_watch_button"
                  onClick={handlePayNow}
                >
                  Pay now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
