import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "./index.css";

import Signin from "./pages/customer/Signin";
import Signup from "./pages/customer/Signup";
import Home from "./pages/customer/Home";
import ListBestSellingWatches from "./pages/customer/ListBestSellingWatches";
import ListBestSaleWatches from "./pages/customer/ListBestSaleWatches";
import ListLatestWatches from "./pages/customer/ListLatestWatches";
import WatchDetail from "./pages/customer/WatchDetail";
import Search from "./pages/customer/Search";
import WatchList from "./pages/customer/WatchList";
import Cart from "./pages/customer/Cart";
import PaymentPage from "./pages/customer/PaymentPage";
import Orders from "./pages/customer/Orders";
import Profile from "./pages/customer/Profile";
import ChangePassword from "./pages/customer/ChangePassword";


import AdminSignin from "./pages/admin/AdminSignin";
import AdminHome from "./pages/admin/AdminHome";
import ManagementOder from "./pages/admin/ManagementOder";
import ManageWatch from "./pages/admin/ManageWatch";
import ManagementStaff from "./pages/admin/ManagementStaff";
import ManagementDiscount from "./pages/admin/ManagementDiscount";
import ShipperComplete from "./pages/admin/ShipperComplete";
import AdminChangePass from "./pages/admin/AdminChangePass";
import MangementSupplier from "./pages/admin/MangementSupplier";

import Test from "./pages/admin/Test";
export default function App() {
  return (
    <BrowserRouter basename="/dlbwatchofficial">
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/watchlist" element={<WatchList />} />
        <Route path="/watchlistbestsell" element={<ListBestSellingWatches />} />
        <Route path="/list-best-sale-watches" element={<ListBestSaleWatches />}/>
        <Route path="/list-latest-watches" element={<ListLatestWatches />} />
        <Route path="/watch/:watchId" element={<WatchDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/paymentpage" element={<PaymentPage />} />
        <Route path="/orders" element={<Orders/>} />
        <Route path="/account/profile" element={<Profile />} />
        <Route path="/account/changepass" element={<ChangePassword />} />

        <Route path="/admin/signin" element={<AdminSignin />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/order-management" element={<ManagementOder />} />
        <Route path="/admin/watch-management" element={<ManageWatch />} />
        <Route path="/admin/staff-management" element={<ManagementStaff />} />
        <Route path="/admin/discount-management" element={<ManagementDiscount />} />
        <Route path="/admin/supplier-management" element={<MangementSupplier />} />

        <Route path="/admin/changepass" element={<AdminChangePass />} />

        <Route path="/admin/shipper" element={<ShipperComplete />} />
        

        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

reportWebVitals();
