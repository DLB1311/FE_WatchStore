import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import urlImg from "../../services/urlImg";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../css/watchlist.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

const ListLatestWatches = () => {
  const [watchesByBrand, setWatchesByBrand] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [watchesToShow, setWatchesToShow] = useState({});

  useEffect(() => {
    async function fetchData() {
      const response = await API.get("/watch/getNewWatches");
      setWatchesByBrand(response.data.data);
      // Initialize watchesToShow state with default values
      const watchesToShowObj = {};
      response.data.data.forEach((brand) => {
        watchesToShowObj[brand.MaHang] = 8; // Show 8 watches per brand by default
      });
      setWatchesToShow(watchesToShowObj);
    }
    fetchData();
  }, []);

  const handleSeeMore = (brandId) => {
    setWatchesToShow((prevState) => ({
      ...prevState,
      [brandId]: prevState[brandId] + 8,
    }));
  };

  return (
    <div class="form_watchlist">
      <Header />
      <div id="watchlist_container">
        <div class="watchlist_content">
          <div class="pl_watches anchor-plp-sections">
            <section class="pl_section js-plp-section" data-group="1612">
              <div class="pl_section__header">
                <h3 class="pl_section__title title-36-light">Watches Latest</h3>
              </div>
              <div class="pl_section__elements-wrapper">
                {watchesByBrand.map((brand) => (
                  <div key={brand.MaHang}>
                    <div class="pl_section__header">
                      <h3 class="pl_section__title title-36-light">
                        {brand.TenHang}
                      </h3>
                    </div>
                    <ul class="pl_section__elements anchor-plp-list-elements">
                    {brand.watches.slice(0, watchesToShow[brand.MaHang]).map((watch) => (
                        <li key={watch.MaDH} class="ts_watch js-plp-watch">
                          <Link
                            to={`/watch/${watch.MaDH}`}
                            data-list-online-exclusive="false"
                            class="ts_watch__tile js_watch_link"
                          >
                            <figure class="ts_watch__card">
                              <ul class="sc_watch__label-list">
                                <li>
                                  {watch.is_new && (
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
                              <img
                                src={urlImg + watch.HinhAnh}
                                alt={watch.TenDH}
                              />

                              <figcaption>
                                <h2 class="ts_watch__subcollection title-16">
                                  {watch.TenDH}
                                </h2>
                                <div class="ts_watch__divider"></div>
                                <small
                                  class="ts_watch__price label-14 tooltip-relative tooltip-touchable"
                                  aria-describedby="price-show-info-4146"
                                >
                                  <div className="watch-latest-price">
                                    {watch.GiaGoc !== watch.GiaSauKhuyenMai ? (
                                      <>
                                        <h2 className="original-price">
                                          {watch.GiaGoc.toLocaleString()} VND
                                        </h2>
                                        <h1 className="discounted-price">
                                          {watch.GiaSauKhuyenMai.toLocaleString()}{" "}
                                          VND
                                        </h1>
                                      </>
                                    ) : (
                                      <h1 className="discounted-price">
                                        {watch.GiaSauKhuyenMai !== 0
                                          ? watch.GiaSauKhuyenMai.toLocaleString() +
                                            "VND"
                                          : "Contact for price"}
                                      </h1>
                                    )}
                                  </div>
                                </small>
                              </figcaption>
                            </figure>
                          </Link>
                          <button
                            type="button"
                            class="wl_button wl_button--tile-cta js-wishlist-btn"
                          >
                            <FavoriteBorderOutlinedIcon aria-hidden="true"></FavoriteBorderOutlinedIcon>
                          </button>
                        </li>
                      ))}
                    </ul>
                    {brand.watches.length > watchesToShow[brand.MaHang] && (
                      <div class="pd_hero__cta">
                        <div class="pd_hero__make_appointment">
                          <button
                            class="button"
                            onClick={() => handleSeeMore(brand.MaHang)}
                          >
                            <span class="link">View more</span>
                            <span
                              class="icon icon-close"
                              aria-hidden="true"
                            ></span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListLatestWatches;
