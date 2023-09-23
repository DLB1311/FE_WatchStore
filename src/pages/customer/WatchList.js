import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../services/api";
import urlImg from "../../services/urlImg";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../css/watchlist.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { TextField } from "@mui/material";
import  sanitizeSearchQuery  from '../../utils/sanitizeSearchQuery';


const WatchList = () => {

  const navigate = useNavigate();
  const [watches, setWatches] = useState([]);
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);

  const [selectedBrandIds, setSelectedBrandIds] = useState([]);
  const [selectedTypeIds, setSelectedTypeIds] = useState([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const brandsQuery = searchParams.get("b") || "";
  const typesQuery = searchParams.get("t") || "";

  const [filteredWatches, setFilteredWatches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      const brandResponse = await API.get("watch/getAllBrands");
      const typeResponse = await API.get("watch/getAllTypes");

      setBrands(brandResponse.data.brands);
      setTypes(typeResponse.data.types);
      fetchWatches(brandsQuery, typesQuery);
    }
    fetchData();
  }, []);

  const handleBrandChange = (event) => {
    const selectedBrandValues = event.target.value;
    setSelectedBrandIds(selectedBrandValues);

    const brandsString = selectedBrandValues.join(",");
    navigate(`?b=${brandsString}&t=${typesQuery}`);

    handleSearchChange({ target: { value: searchQuery } });
    fetchWatches(brandsString, typesQuery);
  };

  const handleTypeChange = (event) => {
    const selectedTypeValues = event.target.value;
    setSelectedTypeIds(selectedTypeValues);

    // Update the URL with the selected type IDs
    const typesString = selectedTypeValues.join(",");
    navigate(`?b=${brandsQuery}&t=${typesString}`);

    handleSearchChange({ target: { value: searchQuery } });
    fetchWatches(brandsQuery, typesString);
  };

  async function fetchWatches(selectedBrands, selectedTypes) {
    try {
      const response = await API.get(
        `/watch/getWatchesByBrandAndType?brands=${selectedBrands}&types=${selectedTypes}`
      );

      setWatches(response.data.data);
      setFilteredWatches(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (brandsQuery) {
      const brandsArray = brandsQuery.split(",");
      setSelectedBrandIds(brandsArray);
    }

    if (typesQuery) {
      const typesArray = typesQuery.split(",");
      setSelectedTypeIds(typesArray);
    }

    fetchWatches(brandsQuery, typesQuery);
  }, [brandsQuery, typesQuery]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  function getStyles(name, selectedNames, theme) {
    return {
      fontWeight:
        selectedNames.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const theme = useTheme();

  const [showMore, setShowMore] = useState(false);
  const [displayedWatches, setDisplayedWatches] = useState([]);

  useEffect(() => {
    setDisplayedWatches(watches.slice(0, 8));
  }, [watches]);
  const handleSeeMore = () => {
    const additionalWatchesCount = 8;
    const currentDisplayedCount = displayedWatches.length;
    const fromIndex = currentDisplayedCount;
    const toIndex = currentDisplayedCount + additionalWatchesCount;
    const additionalWatches = watches.slice(fromIndex, toIndex);
    setDisplayedWatches([...displayedWatches, ...additionalWatches]);
    if (toIndex >= watches.length) {
      setShowMore(false);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    const sanitizedValue = sanitizeSearchQuery(value); 

    const filteredData = watches.filter(
      (watch) =>
        watch.tendh.toLowerCase().includes(sanitizedValue ) 
    );

    setFilteredWatches(filteredData);
    setSearchQuery(value);
  };

  return (
    <div class="form_watchlist">
      <Header />
      <div id="watchlist_container">
        <div class="watchlist_content">
          <div class="pl_header">
            <div>
              <FormControl sx={{ m: 1, width: 300 }}>
            <TextField
                  id="search"
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  label="Search"
                />
                </FormControl>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">Brand</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={selectedBrandIds} // Use the selectedBrandIds state variable
                  onChange={handleBrandChange}
                  input={
                    <OutlinedInput id="select-multiple-chip" label="Brand" />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((brandId) => {
                        const brand = brands.find(
                          (brand) => brand.MaHang === brandId
                        );
                        return (
                          <Chip key={brandId} label={brand?.TenHang || ""} />
                        );
                      })}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {brands.map((brand) => (
                    <MenuItem
                      key={brand.MaHang}
                      value={brand.MaHang} // Store the brand ID
                      style={getStyles(brand.TenHang, selectedBrandIds, theme)}
                    >
                      {brand.TenHang}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, width: 300 }}>

                
                <InputLabel id="demo-multiple-chip-label">Type</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={selectedTypeIds} // Use the selectedTypeIds state variable
                  onChange={handleTypeChange}
                  input={
                    <OutlinedInput id="select-multiple-chip" label="Type" />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((typeId) => {
                        const type = types.find(
                          (type) => type.MaLoai === typeId
                        );
                        return (
                          <Chip key={typeId} label={type?.TenLoai || ""} />
                        );
                      })}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {types.map((type) => (
                    <MenuItem
                      key={type.MaLoai}
                      value={type.MaLoai} // Store the type ID
                      style={getStyles(type.TenLoai, selectedTypeIds, theme)}
                    >
                      {type.TenLoai}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div class="pl_watches anchor-plp-sections">
            <section class="pl_section js-plp-section" data-group="1612">
              <div class="pl_section__header">
                <h3 class="pl_section__title title-36-light">Watches</h3>
              </div>
              <div class="pl_section__elements-wrapper">
                <ul class="pl_section__elements anchor-plp-list-elements">
                  {filteredWatches.map((watch) => (
                    /*---------------- 1 đồng hồ test -----------------------------*/
                    <li key={watch.MaDH} class="ts_watch js-plp-watch">
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

                          <img src={urlImg + watch.hinhAnh} alt={watch.tendh} />
                          <figcaption>
                            <span class="ts_watch__collection label-12">
                              {watch.tenhang}
                            </span>
                            <h2 class="ts_watch__subcollection title-16">
                              {watch.tendh}
                            </h2>
                            <div class="ts_watch__divider"></div>
                            <small
                              class="ts_watch__price label-14 tooltip-relative tooltip-touchable"
                              aria-describedby="price-show-info-4146"
                            >
                              {/* <span class="js-watch-price">
                                ${watch.GiaSauKhuyenMai}
                              </span> */}
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
                                      " VND"
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
                        <FavoriteBorderOutlinedIcon aria-hidden="true" />
                      </button>
                    </li>
                    /*---------------- 1 đồng hồ test END -----------------------------*/
                  ))}
                </ul>
              </div>

              {!showMore && displayedWatches.length < watches.length && (
                <div class="pd_hero__cta">
                  <div class="pd_hero__make_appointment">
                    <button class="button" onClick={handleSeeMore}>
                      <span class="link">View more</span>
                      <span class="icon icon-close" aria-hidden="true"></span>
                    </button>
                  </div>
                </div>
              )}

            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WatchList;
