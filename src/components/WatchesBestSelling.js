import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Header from "./Header";
import "../css/home.css";
import urlImg from "../services/urlImg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const WatchesBestSelling = () => {
  const [watches, setWatches] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await API.get("/watch/getBestSellingWatches");
      setWatches(response.data.data.slice(0, 15));
    }
    fetchData();
  }, []);

  //   "MaDH": "DH003     ",
  //   "TenDH": "Rolex Cosmograph Daytona",
  //   "GiaSauKhuyenMai": 40000,
  //   "GiaGoc": 40000,
  //   "HinhAnh": "Rolex-DaytonaCosmograph.png",
  //   "is_new": true,
  //   "TotalOrders": 1,
  //   "TotalQuantity": 2,
  //   "PhanTramGiam": null

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(5, watches.length),
    slidesToScroll: Math.min(5, watches.length),
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
    <div id="new-watch-showcase">
      <div className="header-title">
        <h2 className="title-list-watch cl-black">BEST SELLING</h2>
        <Link
          to={`/watchlistbestsell`}
          class="seemorebutton button button-dark js_make_appointment_btn js_ma_watch_button"
        >
          VIEW MORE
        </Link>
      </div>
      <div className="slider-wrapper-wl">
        <Slider {...settings} className="watches">
          {watches.map((watch) => (
            <div key={watch.MaDH} className="watchlatest">
              <Link to={`/watch/${watch.MaDH}`} className="watches-link">
                <img src={urlImg + watch.HinhAnh} />
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
  );
};

export default WatchesBestSelling;
