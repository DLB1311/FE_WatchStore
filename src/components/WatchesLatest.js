import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Header from "./Header";
import "../css/home.css";
import urlImg from "../services/urlImg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const WatchesLatest = () => {
  const [latestWatches, setLatestWatches] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(-1);

  useEffect(() => {
    async function fetchData() {
      const response = await API.get("/watch/getNewWatches");
      setLatestWatches(response.data.data);
    }
    fetchData();
  }, []);

  // {
  //     "success": true,
  //     "data": [
  //         {
  //             "MaHang": "HL        ",
  //             "TenHang": "Hublot",
  //             "MoTa": null,
  //             "HinhAnh": null,
  //             "watches": [
  //                 {
  //                     "MaDH": "DH004     ",
  //                     "TenDH": "Hublot Big Bang MP",
  //                     "GiaSauKhuyenMai": null,
  //                     "GiaGoc": 59000000,
  //                     "HinhAnh": "Hublot-Big-Bang-MP-09-Tourbillon-Bi-Axis.png",
  //                     "is_new": true,
  //                     "PhanTramGiam": null
  //                 },
  //                 {
  //                     "MaDH": "DH005     ",
  //                     "TenDH": "Hublot Big Bang Sang Bleu II",
  //                     "GiaSauKhuyenMai": -419750400,
  //                     "GiaGoc": 12345600,
  //                     "HinhAnh": "Hublot-Big-Bang-Sang-Bleu-II-Titanium-White-Pavé-45-mm-soldier-shot.png",
  //                     "is_new": true,
  //                     "PhanTramGiam": 35
  //                 }
  //             ]
  //         },
  //         {
  //             "MaHang": "RL        ",
  //             "TenHang": "Rolex",
  //             "MoTa": null,
  //             "HinhAnh": null,
  //             "watches": [
  //                 {
  //                     "MaDH": "DH002     ",
  //                     "TenDH": "Rolex Yacht-Master 42 ",
  //                     "GiaSauKhuyenMai": null,
  //                     "GiaGoc": 300000000,
  //                     "HinhAnh": "Rolex-YachtMaster42.png",
  //                     "is_new": true,
  //                     "PhanTramGiam": null
  //                 },
  //                 {
  //                     "MaDH": "DH003     ",
  //                     "TenDH": "Rolex Cosmograph Daytona",
  //                     "GiaSauKhuyenMai": null,
  //                     "GiaGoc": 4000000,
  //                     "HinhAnh": "Rolex-DaytonaCosmograph.png",
  //                     "is_new": true,
  //                     "PhanTramGiam": null
  //                 }
  //             ]
  //         }
  //     ]
  // }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hoverIndex >= 0 && hoverIndex < latestWatches.length) {
        const newWatches = [...latestWatches];
        const brandWatches = newWatches[hoverIndex].watches;
        const firstWatch = brandWatches.shift();
        brandWatches.push(firstWatch);
        setLatestWatches(newWatches);
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [hoverIndex, latestWatches]);

  const handleHover = (brandIndex, watchIndex) => {
    if (watchIndex === 0) {
      setHoverIndex(brandIndex);
    } else {
      setHoverIndex(-1);
    }
  };

  const settings2 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(3, latestWatches.length),
    slidesToScroll: Math.min(3, latestWatches.length),
    initialSlide: 0,
    responsive: [
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
      <h2 className="title-list-watch cl-black">NEW WATCHES</h2>
      <Link to={'/list-latest-watches'} class="seemorebutton button button-dark js_make_appointment_btn js_ma_watch_button">VIEW MORE</Link>
      </div>

      <div className="slider-wrapper-wl">
        <Slider {...settings2} className="watches">
          {latestWatches.map((brand, brandIndex) => (
            <div key={brand._id}>
                <h3 className="brand-latest-title">{brand.TenHang}</h3>
              <div className="brandwatches">
                {brand.watches.map((watch, watchIndex) => (
                  <Link to={`/watch/${watch.MaDH}`} className="watches-link">
                    

                    <div
                      key={watch._id}
                      className="watchlatest"
                      onMouseEnter={() => handleHover(brandIndex, watchIndex)}
                      onMouseLeave={() => setHoverIndex(-1)}
                    >
                      <img src={urlImg + watch.HinhAnh} alt={watch.TenDH} />
                      <ul class="sc_watch__label-list">
                        <li>
                          {watch.is_new == true && (
                            <span class="sc_watch__new_label label-10">
                              New
                            </span>
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
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default WatchesLatest;
