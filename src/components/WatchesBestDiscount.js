import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import urlImg from "../services/urlImg";


import WatchesLatest from "./WatchesLatest";
import "../css/home.css";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const WatchesBestDiscount = () => {
  const [watches, setWatches] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await API.get("/watch/getWatchesWithHighestDiscount");
      setWatches(response.data.data);
    }
    fetchData();
  }, []);

  // {
  //     "success": true,
  //     "data": [
  //         {
  //             "MaDH": "DH001     ",
  //             "TenDH": "Rolex Daytona Rainbow Black",
  //             "GiaSauKhuyenMai": 160000000,
  //             "GiaGoc": 200000000,
  //             "HinhAnh": "Rolex-Daytona-rainbowblack.png",
  //             "is_new": true,
  //             "PhanTramGiam": 20
  //         }
  //     ]
  // }

  const settings = {
    dots: false,
    infinite: true,
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
    <div id="watch-showcase">
      <div className="header-title">
        <h2 class="title-list-watch">WATCHES ON SALE</h2>
      <Link to={'/list-best-sale-watches'} class="seemorebutton button">VIEW MORE</Link>
      </div>
      
      <div class="slider-wrapper">
        <Slider {...settings} className="watches">
          {watches.map((watch) => (
            <div key={watch._id} className="watch">
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
              <h3 className="watch-title">{watch.TenDH}</h3>
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

export default WatchesBestDiscount;
