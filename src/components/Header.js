import React, { useState, useEffect } from "react";
import "../css/header.css";
import { Link } from "react-router-dom";
import { useNavigate  } from "react-router-dom";
import API from "../services/api";
import urlImg from "../services/urlImg";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const Header = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [customer, setCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSearchText, setShowSearchText] = useState(true);

  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  
  const [searchTextIndex, setSearchTextIndex] = useState(0);
  const searchOptions = ["Watches", "Brands", "Types"];
  const [currentSearchText, setCurrentSearchText] = useState("");

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

  useEffect(() => {
    let interval;
    if (showModal) {
      interval = setInterval(() => {
        setSearchTextIndex((prevIndex) => prevIndex + 1);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [showModal]);

  useEffect(() => {
    if (showModal) {
      if (searchTextIndex >= 0 && searchTextIndex < searchOptions.length) {
        setCurrentSearchText(searchOptions[searchTextIndex]);
      } else {
        setCurrentSearchText("");
        setSearchTextIndex(0);
      }
    }
  }, [searchTextIndex, searchOptions, showModal]);

  const getCookie = (name) => {
    const cookieValue = document.cookie.match(
      `(^|;)\\s*${name}\\s*=\\s*([^;]+)`
    );
    return cookieValue ? cookieValue.pop() : "";
  };
  useEffect(() => {
    const handleTop = () => {
      const currentScrollPos = window.pageYOffset;

      if (currentScrollPos === 0) {
        document.getElementById("header").classList.add("scroll-top");
      } else {
        document.getElementById("header").classList.remove("scroll-top");
      }
    };
    window.addEventListener("scroll", handleTop);
    return () => window.removeEventListener("scroll", handleTop);
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      if (prevScrollPos > currentScrollPos) {
        document.getElementById("header").classList.remove("scroll-down");
        document.getElementById("header").classList.add("scroll-up");
      } else {
        document.getElementById("header").classList.remove("scroll-up");
        document.getElementById("header").classList.add("scroll-down");
      }
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const handleSearchIconClick = () => {
    setShowModal(true);
    setSearchTextIndex(0);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };


  const handleInputClick = () => {
    setShowSearchText(false);
  };

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (searchText) {
      // Navigate to search page with the entered content
      navigate(`/search?query=${searchText}`);
    }
  };

  return (
    <header id="header" class="scroll-top">
      <div className="header-left">
        <Link to="/home" class="header-button">
          <div className="logo">
            <img src={urlImg + "dlb-logo.png"} alt="Logo" />

            <span class="header-button-text">DLB Watch Official</span>
          </div>
        </Link>
      </div>
      <div className="header-right">
        <div className="vertical-divider" />
        {!customer ? (
          <>
            <div class="header-button" onClick={handleSearchIconClick}>
              <SearchIcon />
            </div>
            <div className="vertical-divider" />
            <Link to="/watchlist" class="header-button">
              Dicover
            </Link>
            <div className="vertical-divider" />
            <Link to="/cart" class="header-button">
              Cart
            </Link>
            <div className="vertical-divider" />

            <Link to="/signup" class="header-button">
              Sign Up
            </Link>
            <div className="vertical-divider" />
            <Link to="/signin" class="header-button">
              Sign In
            </Link>
            <div className="vertical-divider" />
          </>
        ) : (
          <>
            <div class="header-button" onClick={handleSearchIconClick}>
              <SearchIcon />
            </div>
            <div className="vertical-divider" />
            <Link to="/watchlist" class="header-button">
              Dicover
            </Link>
            <div className="vertical-divider" />
            <Link to="/cart" class="header-button">
              Cart
            </Link>
            <div className="vertical-divider" />
            <Link to="/orders" class="header-button">
              User
            </Link>
            <div className="vertical-divider" />
          </>
        )}
      </div>
      {showModal && (
        <div className="search-modal modal modal--dark js-search-modal modal--open">
          <div className="search-modal__nav">
            <button
              class="search-modal__close js-search-modal_close animate_fade-in"
              type="button" onClick={handleCloseModal}
            >
              <CloseIcon />
            </button>
          </div>
          <div className="search-modal__wrapper">
            <div className="search-modal__form">
              <div className="search-modal__form-container">
              {showSearchText && (
              <div
                  aria-hidden="true"
                  className="search-modal__animated-content js-search-modal__animated-content animate_fade-in"
                >
                  
                  
                    <span className="js-search-modal__animated-txt search-modal__animated-txt-search js-search-modal__animated-txt-search animate_fade-in">
                      Search for{"  "}
                    </span>
                  
                  <span className="js-search-modal__animated-txt search-modal__animated-txt search-modal__animated-txt-for">
                    {currentSearchText}
                    </span>
                  
                </div>
               )} 
                <form class="hublot-solr-search animate_grow-in" role="search" onSubmit={handleFormSubmit}>
                  <div class="js-form-wrapper form-wrapper">
                    <div class="js-form-item form-item js-form-type-textfield form-item-search-input js-form-item-search-input form-no-label">
                      <input
                        data-drupal-selector="edit-search-input"
                        type="text"
                        id="edit-search-input"
                        size="60"
                        maxlength="128"
                        class="form-text required"
                        required="required"
                        aria-required="true"
                        aria-label="Search for Watches, News, Events, Boutiques, Anything"
                        onClick={handleInputClick}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div
                      data-drupal-selector="edit-search-actions"
                      class="form-actions js-form-wrapper form-wrapper"
                      id="edit-search-actions"
                    >
                       <input type="submit" className="button js-form-submit form-submit"/>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
