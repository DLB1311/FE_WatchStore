import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import urlImg from "../../services/urlImg";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../css/home.css";
import "../../css/watchdetail.css";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Slider from "react-slick";
import Cookies from "js-cookie";
import Swal from "sweetalert2";


const WatchDetail = () => {
  const { watchId } = useParams();
  const [watch, setWatch] = useState({});
  const [brandWatches, setBrandWatches] = useState([]);
  const navigate = useNavigate(); // initialize navigate
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {

    async function fetchData() {
      const response = await API.get(`/watch/getWatchByMaDH/${watchId}`);
      setWatch(response.data.data);

      const brandResponse = await API.get(`/watch/getRandomWatchesByBrand/${response.data.data.MaHang}`);
            setBrandWatches(brandResponse.data.data);
    }
    fetchData();
  }, [watchId]);

  const getCookie = (name) => {
    const cookieValue = document.cookie.match(
      `(^|;)\\s*${name}\\s*=\\s*([^;]+)`
    );
    return cookieValue ? cookieValue.pop() : "";
  };

  const addToCart = () => {
    if (watch.SoLuongTon > 0) {
      if (watch.GiaSauKhuyenMai === 0) {
        Swal.fire("Out of Stock", "Please contact for price", "error");
      } else {
        const watchId = watch.MaDH;
        const cart = Cookies.get("cart");
        let cartItems = [];

        if (cart) {
          cartItems = JSON.parse(cart);
          const existingItem = cartItems.find((item) => item.watchId === watchId);
          if (existingItem) {
            if (existingItem.quantity < watch.SoLuongTon) {
              existingItem.quantity += 1;
            } else {
              Swal.fire("Maximum Quantity", "The maximum quantity has been reached", "warning");
              return;
            }
          } else {
            cartItems.push({ watchId, quantity: 1 });
          }
        } else {
          cartItems.push({ watchId, quantity: 1 });
        }

        Cookies.set("cart", JSON.stringify(cartItems));

        setCartQuantity((prevQuantity) => prevQuantity + 1);
        Swal.fire({
          title: "Success",
          text: "Added to cart",
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Go to Cart",
          cancelButtonText: "Continue Shopping",
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            // If "Go to Cart" is clicked, redirect to the cart page
            window.location.href = "/dlbwatchofficial/cart";
          } else {
            // If "Continue Shopping" is clicked, continue shopping
            // You can add any logic here if needed
          }
        });
      }
    } else {
      Swal.fire("Out of Stock", "This watch is currently out of stock", "error");
    }
  };




  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(5, brandWatches.length),
    slidesToScroll: Math.min(5, brandWatches.length),
    initialSlide: 0,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true,
                dots: false,
            },
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ],
};


  return (
    <div className="form-watchdetail">
      <Header />
      <div id="watchdetail">
        <div className="js_pd_hero pd_hero component component--type--pd-hero component--view-mode--default font_color_">
          <div className="pd_hero__wrapper jd_pd_hero">
            <div className="pd_hero__content">
              <div className="pd_hero__content_details pd_hero__col">
                <div className="pd_hero__content_flags"></div>
                <div className="pd_hero__title--desktop">
                  <span className="label-10">{watch.TenHang}</span>
                  <h1 className="js_nft_title title-40">{watch.TenDH}</h1>
                </div>
                <div className="pd_hero__divider"></div>

                <div className="pd_hero__actions">
                  <span className="label-16 pd_hero__actions_spacing tooltip-relative tooltip-touchable">
                    <div className="watch-detail-price">
                      {watch.GiaGoc !== watch.GiaSauKhuyenMai ? (
                        <>
                          <h2 className="original-price">
                            {watch.GiaGoc.toLocaleString()} VND
                          </h2>
                          <h1 className="discounted-price">
                            {watch.GiaSauKhuyenMai.toLocaleString()} VND
                          </h1>
                        </>
                      ) : (
                        <h1 className="discounted-price">
                          {watch.GiaSauKhuyenMai !== undefined && watch.GiaSauKhuyenMai !== 0 ? watch.GiaSauKhuyenMai.toLocaleString() + ' VND' : "Contact for price"}
                        </h1>
                      )}
                    </div>
                  </span>
                  <div className="pd_hero__actions_btns">
                    <button
                      type="button"
                      className="wl_button pd_hero__action-button js-wishlist-btn"
                    >
                      <FavoriteBorderOutlinedIcon aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      data-id="3161"
                      className="share_button pd_hero__action-button js_share_btn"
                      aria-label="Open the share modal"
                    >
                      <span
                        aria-hidden="true"
                        className="icon-arrow-forward"
                      ></span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pd_hero__content_watch pd_hero__col">
                <div className="pd_hero__content_watch_img js_watch_no_nft">
                  <img src={urlImg + watch.HinhAnh} alt="" />
                </div>
                <div className="pd_hero__icons">
                  <span
                    id="watchlist-pd-hero-labelledby-mobile"
                    className="visually-hidden"
                  >
                    Add this watch to your wishlist
                  </span>
                  <button
                    type="button"
                    className="wl_button pd_hero__action-button js-wishlist-btn"
                  >
                    <span
                      className="wl_button__icon icon-wishlist"
                      aria-hidden="true"
                    ></span>
                  </button>
                  <button
                    type="button"
                    data-id="3161"
                    className="share_button pd_hero__action-button js_share_btn"
                    aria-label="Open the share modal"
                  >
                    <span
                      aria-hidden="true"
                      className="icon-arrow-forward"
                    ></span>
                  </button>
                </div>
              </div>

              <div className="pd_hero__content_message pd_hero__col"></div>
            </div>

            <div className="pd_hero__cta">
              <div className="pd_hero__make_appointment">
                <button
                  type="button"
                  className="button button-dark pd_hero__make_appointment_btn js_make_appointment_btn js_ma_watch_button"
                  data-watch-id={watch._id}
                  onClick={addToCart}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="introduction">
        <div className="introduction_container">
          <div className="intro_header">
            <h2>INTRODUCTION</h2>
            <div className="watch_description">
              {watch && <p>{watch.MoTaDH}</p>}
            </div>
          </div>
          <div className="intro_details">
            <div className="watch_detail">
              <h3>TYPE</h3>
              {watch && <p className="wtlb_title">{watch.TenLoai}</p>}
            </div>

            <div className="watch_detail">
              <h3>BRAND</h3>
              {watch && watch.TenHang && (
                <p className="wtlb_title">{watch.TenHang}</p>
              )}
              {watch && watch.TenHang && (
                <p className="wbl_desc">{watch.MoTaHang}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div id="watchbybrand">
        <h2 className="cl-black title-list-watch">EXPLORE WATCHES</h2>
        <div className="slider-wrapper">          
          <Slider {...settings} className="watches">
          {brandWatches.map((watch) => (
            <div key={watch.MaDH} className="watchlatest">
              <Link to={`/watch/${watch.MaDH}`} className="watches-link">
                <img src={urlImg + watch.hinhAnh} />
              </Link>
              <ul class="sc_watch__label-list">
                <li>
                  {watch.is_new == true && (
                    <span class="sc_watch__new_label label-10">New</span>
                  )}
                  {watch.PhanTramGiam && (
                    <span class="sc_watch__new_label label-10">
                      {watch.PhanTramGiam}%
                    </span>
                  )}
                </li>
              </ul>
              <h3 className="watch-latest-title">{watch.TenDH}</h3>

              <div className="watch-latest-price">
                {watch.GiaGoc !== watch.GiaSauKhuyenMai ? (
                  <>
                    <h2 className="original-price">
                      {watch.GiaGoc.toLocaleString()} VND
                    </h2>
                    <h1 className="discounted-price">
                      {watch.GiaSauKhuyenMai.toLocaleString()} VND
                    </h1>
                  </>
                ) : (
                  <h1 className="discounted-price">
                    {watch.GiaSauKhuyenMai !== 0 ? watch.GiaSauKhuyenMai.toLocaleString()+' VND' : "Contact for price"} 
                  </h1>
                )}
              </div>
            </div>
          ))}
        </Slider>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WatchDetail;
