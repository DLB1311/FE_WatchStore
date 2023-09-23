import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../../services/api";
import urlImg from "../../services/urlImg";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../css/search.css";
import Swal from "sweetalert2";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get("query");
    if (query) {
      setSearchQuery(query);
      fetchData(query);
    }
  }, [location.search]);

  const fetchData = async (query) => {
    try {
      const response = await API.get(`/watch/search?query=${query}`);
      const data = response.data;
      setSearchResults(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      // Navigate to search page with the entered content
      navigate(`/search?query=${searchQuery}`);
    }
  };

  return (
    <div class="form_watchlist">
      <Header searchQuery={searchQuery} handleFormSubmit={handleFormSubmit} />
      <div className="layout-content search-results js-search-results">
        <form className="hublot-solr-search" onSubmit={handleFormSubmit}>
          <div className="js-form-wrapper form-wrapper">
            <div className="js-form-item form-item js-form-type-textfield form-item-search-input js-form-item-search-input form-no-label">
              <input
                type="text"
                className="form-text required"
                size="60"
                maxlength="128"
                value={searchQuery}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-actions js-form-wrapper form-wrapper">
              <input
                type="submit"
                className="button js-form-submit form-submit"
              ></input>
            </div>
          </div>
        </form>

        {searchResults.hangs && searchResults.hangs.tenhangs.length > 0 && (
          <div className="search-results__view js-search-results__view">
            <div className="views-element-container">
              <div>
                <div className="search-results__group">
                  <div className="search-results__title">
                    <span className="title-40 js-fade-in-title js-fade-in-title-slow transparent animate_fade-in visible">
                      Brands
                    </span>
                    <small className="subtitle-12 js-fade-in-title js-fade-in-title-slow js-search-results__total-rows transparent animate_fade-in visible">
                      {searchResults.hangs.soketquatimthay}
                    </small>
                  </div>
                  <div className="search-results__group-content">
                    <div className="views-infinite-scroll-content-wrapper clearfix">
                      {searchResults.hangs.tenhangs.map((hang) => (
                        <div className="views-row" key={hang.mahang}>
                          <Link
                            className="search-results__collection"
                            to={`/watchlist?b=${hang.mahang}`}
                          >
                            <span className="title-20">
                              <span>{hang.tenhang}</span>
                            </span>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="search-results__pager"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {searchResults.loais && searchResults.loais.tenloais.length > 0 && (
          <div className="search-results__view js-search-results__view">
            <div className="views-element-container">
              <div>
                <div className="search-results__group">
                  <div className="search-results__title">
                    <span className="title-40 js-fade-in-title js-fade-in-title-slow transparent animate_fade-in visible">
                      Type
                    </span>
                    <small className="subtitle-12 js-fade-in-title js-fade-in-title-slow js-search-results__total-rows transparent animate_fade-in visible">
                      {searchResults.loais.soketquatimthay}
                    </small>
                  </div>
                  <div className="search-results__group-content">
                    <div className="views-infinite-scroll-content-wrapper clearfix">
                      {searchResults.loais.tenloais.map((loai) => (
                        <div className="views-row" key={loai.maloai}>
                          <Link
                            className="search-results__collection"
                            to={`/watchlist?t=${loai.maloai}`}
                          >
                            <span className="title-20">
                              <span>{loai.tenloai}</span>
                            </span>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="search-results__pager"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {searchResults.donghos && searchResults.donghos.watches.length > 0 && (
          <div className="search-results__view js-search-results__view">
            <div className="views-element-container">
              <div>
                <div className="search-results__group ">
                  <div className="search-results__title">
                    <span className="title-40 js-fade-in-title js-fade-in-title-slow transparent animate_fade-in visible">
                      Watches
                    </span>
                    <small className="subtitle-12 js-fade-in-title js-fade-in-title-slow js-search-results__total-rows transparent animate_fade-in visible">
                      {searchResults.donghos.soketquatimthay}
                    </small>
                  </div>
                  <div className="search-results__group-content search-results__watches">
                    <div className="views-infinite-scroll-content-wrapper clearfix">
                      <div class="">
                        <ul class="pl_section__elements-search anchor-plp-list-elements">
                          {searchResults.donghos.watches.map((watch) => (
                            <li
                              class="ts_watch-search js-plp-watch"
                              key={watch.MaDH}
                            >
                              <Link
                                to={`/watch/${watch.MaDH}`}
                                data-list-online-exclusive="false"
                                class="ts_watch__tile js_watch_link"
                              >
                                <figure class="ts_watch__card">
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
                                  <img src={urlImg + watch.hinhAnh} />

                                  <figcaption className="fig-search">
                                    <span class="ts_watch__collection label-12">
                                      {watch.tenhang}
                                    </span>
                                    <h2 class="ts_watch__subcollection title-16">
                                      {watch.tendh}
                                    </h2>

                                    <div class="ts_watch__divider-search"></div>
                                    <small
                                      class="ts_watch__price label-14 tooltip-relative tooltip-touchable"
                                      aria-describedby="price-show-info-4146"
                                    >
                                      <div className="watch-latest-price">
                                        {watch.GiaGoc !==
                                        watch.GiaSauKhuyenMai ? (
                                          <>
                                            <h2 className="original-price">
                                              {watch.GiaGoc.toLocaleString()}{" "}
                                              VND
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
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* {!showMore && ( */}
                      <div class="pd_hero__cta">
                        <div class="pd_hero__make_appointment">
                          <button class="button" >
                            <span class="link">See more</span>
                            <span
                              class="icon icon-close"
                              aria-hidden="true"
                            ></span>
                          </button>
                        </div>
                      </div>
                      {/* )} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Search;
