import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import API from '../../services/api';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import urlImg from "../../services/urlImg";
import SideBar from "../../components/SideBar";
import '../../css/adminform.css';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import getOrderStatusText from "../../utils/orderUtils";
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import getCookie from '../../utils/getCookie';
import formatDate from '../../utils/formatDate';
import formatDateTime from '../../utils/formatDateTime';

import BookingOrderModal from '../../components/BookingOrderModal';
import InvoiceModal from '../../components/InvoiceModal';
import  { getPrintableContent, printInvoice } from '../../utils/printInvoice';

const ManagementOder = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState([]);
  const [selectedBookingOrder, setSelectedBookingOrder] = useState(null);
  const [isAddInvoiceModalOpen, setIsAddInvoiceModalOpen] = useState(false);



  const fetchBookingOrders = async () => {
    const token = getCookie("tokenAdmin");
    if (!token) {
      navigate("/admin/signin");
      return;
    }
    try {
      const response = await API.get('/management/getBookingOrders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        const bookingOrdersWithId = response.data.bookingOrders.map((order) => ({
          ...order,
          id: order.MaPD,
        }));
        setRows(bookingOrdersWithId);
      } else {
        console.log(response.data.message);
      }
    }
    catch (error) {
      navigate("/admin/signin");
    }
  };
  const fetchBookingOrderDetails = async (maPD) => {
    const token = getCookie("tokenAdmin");
    if (!token) {
      navigate("/admin/signin");
      return;
    }
    try {
      const response = await API.get(`/management/getBookingOrderDetails/${maPD}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setSelectedBookingOrder(response.data.bookingOrderData);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleInvoiceCreated = () => {
    fetchBookingOrderDetails(selectedBookingOrder.MaPD);
  };

  const handleApproveOrder = () => {
    fetchBookingOrders();
  };
  



  const handleAddInvoiceClick = (selectedBookingOrder) => {
    setSelectedBookingOrder(selectedBookingOrder);
    setIsAddInvoiceModalOpen(true);
  };

  const handleGetInvoiceClick = async (selectedBookingOrder) => {
    const token = getCookie("tokenAdmin");
    if (!token) {
      navigate("/admin/signin");
      return;
    }

    try {
      const response = await API.get(`/management/getInvoice/${selectedBookingOrder.MaPD}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const invoiceData = response.data.data;
        const printableContent = getPrintableContent(response.data.data);
        printInvoice(printableContent);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while fetching the invoice details.",
      });
    }
  };



  const handleRowClick = (params) => {
    const maPD = params.row.MaPD;
    fetchBookingOrderDetails(maPD);
  };

  useEffect(() => {

    fetchBookingOrders();
  }, []);

  const filteredRows = rows.map((row) => ({
    ...row,
    NgayDat: formatDate(row.NgayDat),
  })).filter(
    (row) => {
      const statusText = getOrderStatusText(row.TrangThai).toLowerCase();
      const searchQueryLower = searchQuery.toLowerCase();
      return (
        (row.HoNN.toLowerCase().includes(searchQueryLower) ||
          row.TenNN.toLowerCase().includes(searchQueryLower) ||
          row.DiaChiNN.toLowerCase().includes(searchQueryLower) ||
          row.SDT.includes(searchQueryLower) ||
          statusText.includes(searchQueryLower)) &&
        (statusFilters.length === 0 || statusFilters.includes(row.TrangThai))
      );
    }
  );
  const handleCheckboxChange = (event) => {
    const statusValue = parseInt(event.target.value);
    setStatusFilters((prevFilters) => {
      if (event.target.checked) {
        return [...prevFilters, statusValue];
      } else {
        return prevFilters.filter((filter) => filter !== statusValue);
      }
    });
  };
  const renderStatusCell = (params) => {
    const statusText = getOrderStatusText(params.value);
    let statusColor = "";
    switch (params.value) {
      case 0:
        statusColor = "#F3A638";
        break;
      case 1:
        statusColor = "#54B7D3";
        break;
      case 2:
        statusColor = "blue";
        break;
      case 3:
        statusColor = "#88dc1b";
        break;
      case 4:
        statusColor = "#E3D4D4";
        break;
      default:
        statusColor = "gray";
        break;
    }
    return (
      <Box
        style={{
          backgroundColor: statusColor,
          color: "white",
          padding: "4px 8px",
          borderRadius: "4px",
        }}
      >
        {statusText}
      </Box>
    );
  };
  const [columns, setColumns] = useState([
    { field: 'MaPD', headerName: 'ID', width: 70 },
    { field: 'NgayDat', headerName: 'Order Date', flex: 1 },
    { field: 'HoNN', headerName: 'First Name', flex: 1 },
    { field: 'TenNN', headerName: 'Last Name', flex: 1 },
    { field: 'DiaChiNN', headerName: 'Address', flex: 1 },
    { field: 'SDT', headerName: 'Phone', flex: 1 },
    {
      field: 'TrangThai',
      headerName: 'Status',
      flex: 1,
      renderCell: renderStatusCell,
    },
  ]);

  return (
    <SideBar>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" style={{ flex: 1 }}>
        <Card variant="outlined" style={{ borderRadius: 16, width: "90%", marginBottom: "20px" }}>
          <CardContent style={{ padding: "30px" }}>
            <h2>Order Management</h2>
          </CardContent>
        </Card>
        <Card variant="outlined" style={{ borderRadius: 16, width: "90%" }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" style={{ marginBottom: "20px" }}>

              <div style={{ display: "flex", alignItems: "center" }}>
                {[0, 1, 2, 3, 4].map((status) => (
                  <Button
                    key={status}
                    variant="contained"
                    style={{
                      backgroundColor: statusFilters.includes(status) ? "black" : "white",
                      color: statusFilters.includes(status) ? "white" : "black",
                      margin: "5px",
                    }}
                    onClick={() => handleCheckboxChange({ target: { value: status, checked: !statusFilters.includes(status) } })}
                  >
                    {getOrderStatusText(status)}
                  </Button>
                ))}
              </div>

              {/* <Button variant="contained" color="primary" style={{ backgroundColor: 'black' }} onClick={() => console.log('Add button clicked')}>
                + Add
              </Button> */}
              <TextField
                label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "30%" }}
              />
            </Box>

            <div style={{ maxHeight: '60vh', width: '100%', overflowY: 'auto' }}>
              <DataGrid style={{ minHeight: '60vh' }} rows={filteredRows} columns={columns} pageSize={5} onRowClick={handleRowClick} />
            </div>
          </CardContent>
        </Card>

        <BookingOrderModal
          selectedBookingOrder={selectedBookingOrder}
          handleAddInvoiceClick={handleAddInvoiceClick}
          handleGetInvoiceClick={handleGetInvoiceClick}
          setSelectedBookingOrder={setSelectedBookingOrder}
          handleApproveOrder={handleApproveOrder}
        />
        <InvoiceModal
          isAddInvoiceModalOpen={isAddInvoiceModalOpen}
          setIsAddInvoiceModalOpen={setIsAddInvoiceModalOpen}
          selectedBookingOrder={selectedBookingOrder}
          handleInvoiceCreated={handleInvoiceCreated} 
        />

      </Box>
    </SideBar>
  );
};
export default ManagementOder;
