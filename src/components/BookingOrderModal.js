import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../services/api";
import Box from "@mui/material/Box";
import urlImg from "../services/urlImg";
import "../css/adminform.css";
import Button from "@mui/material/Button";
import getOrderStatusText from "../utils/orderUtils";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import getCookie from "../utils/getCookie";
import formatDate from "../utils/formatDate";
import formatDateTime from "../utils/formatDateTime";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Autocomplete, TextField } from "@mui/material";

const BookingOrderModal = ({
  selectedBookingOrder,
  handleAddInvoiceClick,
  handleGetInvoiceClick,
  setSelectedBookingOrder,
  handleApproveOrder,
}) => {
  const navigate = useNavigate();
  const [deliveryStaffList, setDeliveryStaffList] = useState([]);
  const [selectedDeliveryStaff, setSelectedDeliveryStaff] = useState(null);
  const [deliveryStaffError, setDeliveryStaffError] = useState(false);

  useEffect(() => {
    const fetchDeliveryStaffList = async () => {
      const token = getCookie("tokenAdmin");
      if (!token) {
        navigate("/admin/signin");
        return;
      }
      try {
        const response = await API.get("/staff/getDeliveryEmployees", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDeliveryStaffList(response.data.deliveryEmployees); // Assuming the API response contains an array of delivery staff names
      } catch (error) {
        console.error("Error fetching delivery staff list", error);
      }
    };

    fetchDeliveryStaffList();
  }, []);

  const calculateTotalPrice = () => {
    if (!selectedBookingOrder) {
      return 0;
    }

    let totalPrice = 0;
    selectedBookingOrder.ChiTietDat.forEach((detail) => {
      totalPrice += detail.SoLuong * detail.DonGia;
    });

    return totalPrice;
  };
  if (!selectedBookingOrder) {
    return null;
  }
  const totalPrice = calculateTotalPrice();

  const handleApproveOrderAndAssignEmployee = async (selectedBookingOrder, selectedDeliveryStaff) => {
    if (!selectedDeliveryStaff) {
      setDeliveryStaffError(true);
      return;
    }

    const token = getCookie("tokenAdmin");
    if (!token) {
      navigate("/admin/signin");
      return;
    }
    try {
      const response = await API.post(
        `/management/updateOrderStatusAndAssignEmployee/${selectedBookingOrder.MaPD}`,
        { maNVGiao: selectedDeliveryStaff.MaNV }, // Sending the selected delivery staff ID in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Order Approved',
          text: 'The order status has been updated and an employee has been assigned for delivery.',
        });
        setSelectedBookingOrder(null);
        handleApproveOrder();

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while updating the order status and assigning an employee.',
      });
    }
  };


  return (
    <Modal
      open={!!selectedBookingOrder}
      onClose={() => setSelectedBookingOrder(null)}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      style={{ zIndex: 4 }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Button
          onClick={() => setSelectedBookingOrder(null)}
          style={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
        >
          X
        </Button>
        <Typography variant="h4" id="modal-title" component="h2" sx={{ mb: 3 }}>
          Order Details
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <Typography sx={{ mt: 1 }}>
              Name: {selectedBookingOrder.HoNN} {selectedBookingOrder.TenNN}
            </Typography>
            <Typography sx={{ mt: 1, maxWidth: "400px" }}>
              Address: {selectedBookingOrder.DiaChiNN}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              Phone: {selectedBookingOrder.SDT}
            </Typography>
            {selectedBookingOrder.MaGiaoDich && (
              <Typography id="modal-description" sx={{ mt: 1 }}>
                Payment ID: {selectedBookingOrder.MaGiaoDich}
              </Typography>
            )}
          </div>
          <div>
            <Typography variant="h5" id="modal-description">
              Status: {getOrderStatusText(selectedBookingOrder.TrangThai)}
            </Typography>
            <Typography id="modal-description" sx={{ mt: 1 }}>
              Order Date: {formatDateTime(selectedBookingOrder.NgayDat)}
            </Typography>

  
            {selectedBookingOrder.TenNVDuyet && (
              <Typography id="modal-description" sx={{ mt: 1 }}>
                Approve Employee: {selectedBookingOrder.TenNVDuyet}
              </Typography>
            )}
            {selectedBookingOrder.TenNVGiao && (
              <Typography id="modal-description" sx={{ mt: 1 }}>
                Delivery Employee: {selectedBookingOrder.TenNVGiao}
              </Typography>
            )}
          </div>
        </div>
        <Box sx={{ maxHeight: "450px", overflowY: "auto", mt: 1 }}>
          {selectedBookingOrder.ChiTietDat.map((detail, index) => (
            <div class="_0OiaZ-">
              <div class="FbLutl">
                <div>
                  <span class="x7nENX">
                    <div></div>
                    <div class="aybVBK">
                      <div class="rGP9Yd">
                        <div class="shopee-image__wrapper">
                          <div class="shopee-image__content">
                            <img
                              src={urlImg + detail.HinhAnh}
                              alt={detail.TenDH}
                            />
                          </div>
                        </div>
                      </div>
                      <div class="_7uZf6Q">
                        <div class="iJlxsT" style={{ lineHeight: "40px" }}>
                          <span class="x5GTyN">{detail.TenDH}</span>
                        </div>
                      </div>
                    </div>
                    <div class="_9UJGhr">
                      <div class="_3F1-5M">x{detail.SoLuong}</div>
                      <span class="-x3Dqh OkfGBc">
                        {detail.DonGia.toLocaleString()} VND
                      </span>
                    </div>
                  </span>
                  <div class="Cde7Oe"></div>
                </div>
              </div>
            </div>
          ))}
        </Box>
        <Typography variant="h4" sx={{ mt: 2 }}>
          Total Price: {totalPrice.toLocaleString()} VND
        </Typography>
        <div style={{ marginTop: "40px" }}>
          {selectedBookingOrder.TrangThai === 1 && (
            <Box display="flex" justifyContent="space-between">
              <Autocomplete
                id="delivery-staff-combobox"
                options={deliveryStaffList}
                getOptionLabel={(staff) => `${staff.Ho} ${staff.Ten} (Delivering: ${staff.NumberOfOrders} )`}
                value={selectedDeliveryStaff}
                onChange={(event, newValue) => {
                  setSelectedDeliveryStaff(newValue);
                  setDeliveryStaffError(false); // Reset the error when a staff is selected
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select delivery staff..."
                    error={deliveryStaffError}
                    helperText={deliveryStaffError && "Please select a delivery staff."}
                  />
                )}
                style={{ width: "50%" }}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  handleApproveOrderAndAssignEmployee(selectedBookingOrder, selectedDeliveryStaff)
                }
                style={{
                  backgroundColor: "black" ,
                  color:  "white",
                  
                }}
              >
                Approve and assign delivery staff
              </Button>
            </Box>
          )}
          {selectedBookingOrder.TrangThai === 2 &&
            !selectedBookingOrder.MaHD && (
              <Button
                variant="contained"
                color="primary"
                style={{ position: "absolute", bottom: 16, right: 16 , backgroundColor: "black" , color:  "white" }}
                onClick={() => handleAddInvoiceClick(selectedBookingOrder)}
                
              >
                Print invoice
              </Button>
            )}
          {!!selectedBookingOrder.MaHD && (
            <Button
              variant="contained"
              color="primary"
              style={{ position: "absolute", bottom: 16, right: 16 , backgroundColor: "black" , color:  "white" }}
              onClick={() => handleGetInvoiceClick(selectedBookingOrder)}
            >
              View Invoice
            </Button>
          )}
        </div>
      </Box>
    </Modal>
  );
};
export default BookingOrderModal;
