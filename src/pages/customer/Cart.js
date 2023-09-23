import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import urlImg from "../../services/urlImg";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../css/watchlist.css";
import "../../css/cart.css";
import "../../css/watchdetail.css";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import getCookie from '../../utils/getCookie';

const Cart = () => {
  const navigate = useNavigate(); // initialize navigate
  const [errorMessage, setErrorMessage] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const [selectedWatches, setSelectedWatches] = useState([]);
  const selectedTotalPrice = selectedWatches.reduce((acc, watchId) => {
    const selectedItem = cartItems.find((item) => item.watchId === watchId);
    if (selectedItem) {
      return acc + selectedItem.watch.GiaSauKhuyenMai * selectedItem.quantity;
    }
    return acc;
  }, 0);

  const handleCheckboxChange = (watchId) => {
    const token = getCookie("token");
    if (!token && !customer) {

      navigate(`/signin?redirect=/cart`);
      return;
    }

    // If the user is logged in, proceed with checkbox state changes as before
    if (selectedWatches.includes(watchId)) {
      setSelectedWatches((prev) => prev.filter((id) => id !== watchId));
    } else {
      setSelectedWatches((prev) => [...prev, watchId]);
    }
  };


  const fetchItems = async () => {
    const cookieData = Cookies.get("cart");
    console.log(cookieData);
  
    if (cookieData) {
      let parsedItems = JSON.parse(cookieData);
  
      const updatedItems = await Promise.all(
        parsedItems.map(async (item) => {
          const response = await API.get(`/watch/getWatchByMaDH/${item.watchId}`);
  
          const watch = response.data.data;
          const quantityInCart = item.quantity;
  
          if (quantityInCart > watch.SoLuongTon) {
            item.quantity = watch.SoLuongTon;
            Swal.fire(
              "Out of Stock",
              `The product "${watch.TenDH}" quantity has been updated to ${watch.SoLuongTon}`,
              "info"
            );
          }
  
          if (watch.SoLuongTon === 0 || watch.GiaSauKhuyenMai === 0 || watch.TrangThai !== 1) {
            Swal.fire(
              "Product Unavailable",
              `The product "${watch.TenDH}" is not available.`,
              "info"
            );
            // Remove the invalid item from parsedItems
            parsedItems = parsedItems.filter((cartItem) => cartItem.watchId !== item.watchId);
            return null; // Return null watch
          }
  
          return {
            watchId: item.watchId,
            quantity: item.quantity,
            watch: watch
          };
        })
      );
  
      // Filter out null watch items and update the cart
      const filteredItems = updatedItems.filter((item) => item !== null);
      setCartItems(filteredItems);
      Cookies.set("cart", JSON.stringify(filteredItems));
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddToCart = async (watchId) => {
    try {
      const response = await API.get(`/watch/getWatchByMaDH/${watchId}`);
      const watch = response.data.data;

      if (watch.SoLuongTon > 0) {
        const cart = Cookies.get("cart");
        let cartItems = [];

        if (cart) {
          cartItems = JSON.parse(cart);
          const existingItem = cartItems.find(
            (item) => item.watchId === watchId
          );
          if (existingItem) {
            if (existingItem.quantity < watch.SoLuongTon) {
              existingItem.quantity += 1;
            } else {
              Swal.fire(
                "Maximum Quantity",
                "The maximum quantity has been reached",
                "warning"
              );
              return;
            }
          } else {
            cartItems.push({ watchId, quantity: 1 });
          }
        } else {
          cartItems.push({ watchId, quantity: 1 });
        }

        Cookies.set("cart", JSON.stringify(cartItems));

        setCartItems((prevItems) => {
          const updatedItems = [...prevItems];
          const existingItemIndex = updatedItems.findIndex(
            (item) => item.watchId === watchId
          );
          if (existingItemIndex !== -1) {
            const existingItem = updatedItems[existingItemIndex];
            existingItem.quantity += 1;
          } else {
            updatedItems.push({ watchId, quantity: 1, watch });
          }
          return updatedItems;
        });
      } else {
        Swal.fire(
          "Out of Stock",
          "This watch is currently out of stock",
          "error"
        );
      }
    } catch (error) {
      setErrorMessage("Failed to add item to cart. Please try again later.");
    }
  };

  const handleSub = async (watchId) => {
    try {
      const response = await API.get(`/watch/getWatchByMaDH/${watchId}`);
      const watch = response.data.data;
      const cart = Cookies.get("cart");
      let cartItems = [];

      if (cart) {
        cartItems = JSON.parse(cart);
        const existingItemIndex = cartItems.findIndex(
          (item) => item.watchId === watchId
        );
        if (existingItemIndex !== -1) {
          const existingItem = cartItems[existingItemIndex];
          if (existingItem.quantity > 1) {
            existingItem.quantity -= 1;
          } else {
            cartItems.splice(existingItemIndex, 1);
          }
          Cookies.set("cart", JSON.stringify(cartItems));

          setCartItems((prevItems) => {
            const updatedItems = [...prevItems];
            const existingItemIndex = updatedItems.findIndex(
              (item) => item.watchId === watchId
            );
            if (existingItemIndex !== -1) {
              const existingItem = updatedItems[existingItemIndex];
              existingItem.quantity -= 1;
              if (existingItem.quantity === 0) {
                updatedItems.splice(existingItemIndex, 1);
              }
            }
            return updatedItems;
          });
        } else {
          Swal.fire("Item Not Found", "The item is not in the cart", "error");
        }
      }
    } catch (error) {
      setErrorMessage(
        "Failed to remove item from cart. Please try again later."
      );
    }
  };

  const handleRemove = async (watchId) => {
    try {
      const cart = Cookies.get("cart");
      let cartItems = [];

      if (cart) {
        cartItems = JSON.parse(cart);
        const existingItemIndex = cartItems.findIndex(
          (item) => item.watchId === watchId
        );
        if (existingItemIndex !== -1) {
          cartItems.splice(existingItemIndex, 1);
          Cookies.set("cart", JSON.stringify(cartItems));

          // Show a success message indicating that the product has been removed from the cart
          Swal.fire(
            "Removed from Cart",
            "The product has been removed from the cart.",
            "success"
          );

          setCartItems((prevItems) =>
            prevItems.filter((item) => item.watchId !== watchId)
          );
        } else {
          Swal.fire("Item Not Found", "The item is not in the cart", "error");
        }
      }
    } catch (error) {
      setErrorMessage(
        "Failed to remove item from cart. Please try again later."
      );
    }
  };

  const subTotal = cartItems.reduce((acc, item) => {
    return acc + item.watch.GiaSauKhuyenMai * item.quantity;
  }, 0);
  const tax = subTotal * 0.1;
  const total = subTotal + tax;

  const [customer, setCustomer] = useState(null);
  useEffect(() => {
    async function fetchData() {
      const token = getCookie("token");
      if (!token) {
        setCustomer(null);
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
      }
    }
    fetchData();
  }, []);

  const [showReceiverInfo, setShowReceiverInfo] = useState(false);
  const [receiverInfo, setReceiverInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
  });

  const handleOrderNow = () => {
    const token = getCookie("token");
    if (token && customer) {
      // If the user is logged in, show the receiver's information form
      setShowReceiverInfo(true);

      // Pre-fill the receiver's information with user data (if available)
      if (customer) {
        setReceiverInfo({
          firstName: customer.Ten,
          lastName: customer.Ho,
          address: customer.DiaChi,
          phone: customer.SDT,
        });
      }
    } else {
      navigate(`/signin?redirect=/cart`);
    }
  };

  const handleReceiverInfoChange = (event) => {
    const { name, value } = event.target;
    setReceiverInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleOrderSubmit = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        navigate(`/signin?redirect=/cart`);
        return;
      }

      if (selectedWatches.length === 0) {
        Swal.fire(
          "No Items Selected",
          "Please select items to order",
          "warning"
        );
        return;
      }

      // Prepare the order data
      const orderData = {
        firstName: receiverInfo.firstName,
        lastName: receiverInfo.lastName,
        address: receiverInfo.address,
        phoneNumber: receiverInfo.phone,
        cartItems: selectedWatches.map((watchId) => {
          const selectedItem = cartItems.find(
            (item) => item.watchId === watchId
          );
          return {
            productId: selectedItem.watchId,
            quantity: selectedItem.quantity,
            price: selectedItem.watch.GiaSauKhuyenMai,
          };
        }),
      };

      // Call the API to place the order
      const response = await API.post("/customer/placeOrder", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // If order is successful, remove the selected watches from the cart and update the state
        const updatedCartItems = cartItems.filter(
          (item) => !selectedWatches.includes(item.watchId)
        );
        setCartItems(updatedCartItems);
        // Update the cookie with the remaining cart items
        Cookies.set("cart", JSON.stringify(updatedCartItems));
        // Clear the selected watches
        setSelectedWatches([]);

        // Show a success message indicating that the order is placed successfully
        Swal.fire({
          title: "Order Placed",
          text: "Your order has been placed successfully",
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Pay Now",
          cancelButtonText: "View Order",
        }).then((result) => {
          if (result.isConfirmed) {
            const orderId = response.data.MaPD;
            navigate("/paymentpage?id=" + orderId);
          } else {

          }
        });

        // Hide the receiver's information form
        setShowReceiverInfo(false);
      } else {
        // Show an error message if the order is not successful
        Swal.fire(
          "Order Failed",
          "Failed to place the order. Please try again later.",
          "error"
        );
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "An error occurred while placing the order", "error");
      await fetchItems();
    }
  };

  return (
    <div class="form_watchlist">
      <Header />
      <div id="watchlist_container">
        <div id="maincontent" class="page-main contents">
          <div class="main main-s">
            {cartItems.length > 0 ? (
              <>
                <div class="sec bd-t-gry-1">
                  <div class="sec-inr pt-none">
                    <form id="form-validate" class="form form-cart">
                      <div
                        id="shopping-cart-table"
                        class="cart items data table table-wrapper"
                      >
                        <div class="dataItem mybag-dataItem">
                          {cartItems.map((item) => (
                            <div
                              key={item.MaDH}
                              class="dataItem-inr dataItem-2col"
                            >
                              <div class="dataItem-img">
                                <img
                                  class="product-image-photo"
                                  src={urlImg + item.watch.HinhAnh}
                                  alt={item.watch.TenDH}
                                  loading="lazy"
                                  width="110"
                                  height="160"
                                  alt=" "
                                />
                              </div>
                              <div class="dataItem-txt">
                                <div class="col title">
                                  <div class="dataItem-header dataItem-header-2col">
                                    <div class="dataItem-header-col cart_productname_wrapper">
                                      <h2 class="dataItem-title">
                                        <span class="is-category casio_us">
                                          {item.watch.TenDH}
                                        </span>
                                        <span class="is-model"></span>
                                        <button
                                          onClick={() =>
                                            handleRemove(item.watchId)
                                          }
                                        >
                                          <CloseOutlinedIcon />
                                        </button>
                                      </h2>
                                      <div class="dataItem-header-col cart_price_wrapper">
                                        <p class="ta-r-pc is-price">
                                          <span
                                            class="price-excluding-tax"
                                            data-label="Excl. Tax"
                                          >
                                            <span class="cart-price">
                                              {item.watch.GiaGoc !==
                                                item.watch.GiaSauKhuyenMai ? (
                                                <>
                                                  <h2 className="original-price">
                                                    {item.watch.GiaGoc.toLocaleString()}{" "}
                                                    VND
                                                  </h2>
                                                  <h1 className="discounted-price">
                                                    {item.watch.GiaSauKhuyenMai.toLocaleString()}{" "}
                                                    VND
                                                  </h1>
                                                </>
                                              ) : (
                                                <h1 className="discounted-price">
                                                  {item.watch.GiaGoc !==
                                                    undefined &&
                                                    item.watch.GiaGoc !== 0
                                                    ? item.watch.GiaGoc.toLocaleString() +
                                                    " VND"
                                                    : "Contact for price"}
                                                </h1>
                                              )}
                                            </span>{" "}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="dataItem-txt w-100-sp qty_delete_container">
                                  <div class="col">
                                    <div class="dataItem-header dataItem-header-2col">
                                      <div class="dataItem-header-col clear-both">
                                        <div class="dataItem-amount is-amount-with-ui qty_wrapper">
                                          <button
                                            type="button"
                                            aria-label="Decrease quantity"
                                            class="btn bg-wht-1 dataItem-amount-mns-btn is-mns-btn decrease-qty"
                                            data-watch-id={item.watch.MaDH}
                                            onClick={(e) =>
                                              handleSub(item.watchId)
                                            }
                                          >
                                            <span class="minus">-</span>
                                          </button>

                                          <input
                                            id="cart-3185159-qty"
                                            class="dataItem-amount-input is-amount input-text qty aaaa"
                                            aria-label="Quantity"
                                            value={item.quantity}
                                            readOnly
                                          />

                                          <button
                                            type="button"
                                            aria-label="Increase quantity"
                                            class="btn bg-wht-1 dataItem-amount-pls-btn is-pls-btn increase-qty"
                                            data-watch-id={item.watch.MaDH}
                                            onClick={() =>
                                              handleAddToCart(item.watchId)
                                            }
                                            disabled={
                                              item.quantity ===
                                              item.watch.SoLuongTon
                                            }
                                          >
                                            <span class="plus">+</span>
                                            <image class="no-display" alt="" />
                                          </button>
                                          <input
                                            className="ip-checkbox"
                                            type="checkbox"
                                            checked={selectedWatches.includes(
                                              item.watchId
                                            )}
                                            onChange={() => handleCheckboxChange(item.watchId)}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="col dataItem-option"></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div class="sec-inr pt-none">
                  <div class="dataItem dataItem-accounting bd-t-gry-1">
                    <div class="dataItem-inr dataItem-accounting-inr dataItem-2col">
                      <h2 class="title-2">Order Summary</h2>
                      <div class="dataItem-txt w-100-sp">
                        <div class="col"></div>{" "}
                        <div class="col">
                          <div
                            id="bottom-cart-totals"
                            class="cart-totals"
                            data-bind="scope:'block-totals'"
                          >
                            <div
                              class="table-wrapper"
                              data-bind="blockLoader: isLoading"
                            >
                              <table class="dataItem-table dataItem-table-price dataItem-table-price-s dataItem-table-total">
                                <tbody>
                                  <tr class="totals sub">
                                    <th class="dataItem-th" scope="row">
                                      <span>Cart Subtotal:</span>
                                      <span class="order-summary-tooltip">
                                        <button aria-label="Cart subtotal tooltip">
                                          <i class="fa fa-question-circle"></i>
                                        </button>
                                        <span
                                          class="tooltip-content"
                                          role="tooltip"
                                        ></span>
                                      </span>
                                    </th>
                                    <td class="dataItem-td">
                                      <span
                                        class="price"
                                        data-th="Cart Subtotal:"
                                      >
                                        {selectedTotalPrice.toLocaleString()}{" "}
                                        VND
                                      </span>
                                    </td>
                                  </tr>

                                  {/* <tr class="totals-tax">
                                    <th
                                      class="dataItem-th mark"
                                      colspan="1"
                                      scope="row"
                                    >
                                      <span>Tax:</span>
                                    </th>
                                    <td
                                      class="dataItem-td amount"
                                      data-th="Tax"
                                    >
                                      <span class="price">
                                        {tax.toLocaleString()} VND
                                      </span>
                                    </td>
                                  </tr> */}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        <div
                          class="col col-total"
                          id="bottom-cart-grand-totals"
                          data-bind="scope:'bottom-grand-total'"
                        >
                          <div class="col col-total">
                            <table class="dataItem-table dataItem-table-price dataItem-table-total">
                              <tbody>
                                <tr>
                                  <th class="dataItem-th">Estimated Total:</th>
                                  <td
                                    class="dataItem-td"
                                    data-th="Total Amount"
                                  >
                                    <span data-bind="text: getValue()">
                                      {selectedTotalPrice.toLocaleString()} VND
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

                {showReceiverInfo && (
                  <div className="profile">
                    <div className="profile-container">
                      <h2 className="h2-profile">Receiver's Information</h2>
                      <div className="info-blockform">
                        <form>
                          <div className="inputname">
                            <div className="firstname">
                              <label
                                className="label-account"
                                htmlFor="firstName"
                              >
                                First name
                              </label>
                              <input
                                className="input-account"
                                type="text"
                                name="firstName"
                                placeholder="Enter first name"
                                id="firstName"
                                required
                                value={receiverInfo.firstName}
                                onChange={handleReceiverInfoChange}
                              />
                            </div>
                            <div>
                              <label
                                className="label-account"
                                htmlFor="lastName"
                              >
                                Surname
                              </label>
                              <input
                                className="input-account"
                                type="text"
                                name="lastName"
                                placeholder="Enter surname"
                                id="lastName"
                                required
                                value={receiverInfo.lastName}
                                onChange={handleReceiverInfoChange}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="label-account" htmlFor="address">
                              Address
                            </label>
                            <input
                              className="input-account"
                              type="text"
                              name="address"
                              id="address"
                              placeholder="Enter address"
                              required
                              value={receiverInfo.address}
                              onChange={handleReceiverInfoChange}
                            />
                          </div>
                          <div>
                            <label className="label-account" htmlFor="phone">
                              Mobile Phone Number
                            </label>
                            <input
                              className="input-account"
                              type="text"
                              name="phone"
                              id="phone"
                              placeholder="Mobile phone number"
                              required
                              value={receiverInfo.phone}
                              onChange={handleReceiverInfoChange}
                            />
                          </div>

                          <div className="btn-access">
                            <button
                              type="button"
                              className="button button-dark pd_hero__make_appointment_btn js_make_appointment_btn js_ma_watch_button"
                              onClick={handleOrderSubmit}
                            >
                              Order
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                <div class="pd_hero__cta">
                  {!showReceiverInfo && selectedWatches.length > 0 && (
                    <div class="pd_hero__make_appointment">
                      <button
                        type="button"
                        class="button button-dark pd_hero__make_appointment_btn js_make_appointment_btn js_ma_watch_button"
                        onClick={handleOrderNow}
                      >
                        ORDER NOW
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="sec bd-t-gry-1">
                <div className="sec-inr pt-none">
                  <div className="cart-empty">
                    <h1>You still don't have anything on your cart</h1>
                  </div>
                  <div class="pd_hero__cta">
                    <div class="pd_hero__make_appointment">
                      <Link
                        to={`/watchlist`}
                        type="button"
                        class="button button-dark pd_hero__make_appointment_btn js_make_appointment_btn js_ma_watch_button"
                      >
                        VIEW ALL WATCHES
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
