import Modal from '@mui/material/Modal';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import formatDate from "../utils/formatDate";
import React, { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import getCookie from '../utils/getCookie';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import API from '../services/api';
import OptionsCell from '../utils/OptionsCell';
import Autocomplete from '@mui/material/Autocomplete';


const WholeSaleOrderModal = ({ open, onClose, supplier }) => {
    const navigate = useNavigate();
    const [orderID, setOrderID] = useState('');
    const [addingOrder, setAddingOrder] = useState(false);
    const [wholeSaleOrders, setWholeSaleOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const [orderDetailsModalOpen, setOrderDetailsModalOpen] = useState(false);

    const [orderIDSelected, setOrderIDSelected] = useState('');
    const [watchID, setWatchID] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    const [watchOptions, setWatchOptions] = useState([]);
    const [selectedWatch, setSelectedWatch] = useState(null);

    const [noteId, setNoteId] = useState('');
    const [showNoteModal, setShowNoteModal] = useState(false);

    const [showConfirmReceiptButton, setShowConfirmReceiptButton] = useState(false);
    const ReceivedCell = ({ value, orderId }) => (
        <div>
            <div
                style={{
                    display: 'inline-block',
                    backgroundColor: value ? '#f1c40f' : '#ED2939',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    color: value ? 'white' : 'white',
                }}
            >
                {value ? 'Đã Nhập' : 'Chưa nhập'}
            </div>
            {!value && (
                <Button
                    style={{
                        display: 'inline-block',
                        backgroundColor: '#5DBB63', // Change the color for "Confirm Receipt" button
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: 'white',
                        marginLeft: '10px', // Add some space between the elements
                    }}
                    onClick={() => handleConfirmReceipt(orderId)}
                >
                    Confirm
                </Button>
            )}
        </div>
    );
    const handleConfirmReceipt = (orderId) => {
        setOrderIDSelected(orderId);
        setShowNoteModal(true);
    };


    const handleConfirmReceiptApi = async () => {
        try {
            const token = getCookie("tokenAdmin");
            if (!token) {
                navigate("/admin/signin");
                return;
            }

            if (!noteId ) {
                // Show a SweetAlert notification for missing date range
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Please fill in all information",
                });
                return;
              }

            const response = await API.post(`received_note/addNote/${orderIDSelected}`, {
                noteId: noteId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                // Handle success (e.g., show a success message)
                setShowNoteModal(false); // Close the note modal
                fetchWholeSaleOrders(); // Refresh the orders table
            } else {
                // Handle API error (e.g., show an error message)
            }
        } catch (error) {
            console.error(error);
            // Handle error (e.g., show an error message)
        }
    };
    const handleCancelNoteModal = () => {
        setShowNoteModal(false);
    };





    useEffect(() => {
        if (open) {
            fetchWholeSaleOrders(); // Fetch orders when the modal is opened
        }
    }, [open, supplier]);

    const fetchWholeSaleOrders = async () => {
        try {
            const token = getCookie("tokenAdmin");
            if (!token) {
                navigate("/admin/signin");
                return;
            }

            const response = await API.get(`/wholesale_order/getOrdersBySupplierId/${supplier}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            if (response.data.success) {
                const discounts = response.data.orders;
                const discountsdetailWithId = discounts.map((order) => ({
                    ...order,
                    id: order.MaDDH,
                }));
                setWholeSaleOrders(discountsdetailWithId);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.data.message,
                });
                return [];
            }

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response.data.message,
            });
        }
    };

    const fetchOrderDetails = async (orderId) => {
        try {
            const token = getCookie("tokenAdmin");
            if (!token) {
                navigate("/admin/signin");
                return;
            }

            const response = await API.get(`/wholesale_order/getOrderDetailByOrderId/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                const discounts = response.data.orders;
                const discountsdetailWithId = discounts.map((order) => ({
                    ...order,
                    id: order.MaDH,
                }));
                setOrderDetails(discountsdetailWithId);
                setOrderDetailsModalOpen(true);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.data.message,
                });
                return [];
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response.data.message,
            });
        }
    };

    const handleAddOrder = async () => {
        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }

        if (!orderID) {
            // Show a SweetAlert notification for missing date range
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Please fill in all information",
            });
            return;
        }

        try {
            const response = await API.post(
                '/wholesale_order/addOrder',
                {
                    supplierId: supplier,
                    orderId: orderID,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                // Hiển thị thông báo thành công và cập nhật danh sách đợt khuyến mãi
                Swal.fire({
                    icon: "success",
                    title: "Discount Added",
                    text: "The discount has been added successfully.",
                });
                setOrderID('');
                setAddingOrder(false);
                fetchWholeSaleOrders();
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
                text: error.response.data.message,
            });
        }

    };

    const handleCancel = () => {
        // Reset the form and hide the input fields when the user cancels
        setOrderID('');
        setAddingOrder(false);
    };

    const handleDelete = async (orderId) => {
        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }
        try {
            const response = await API.delete(`/wholesale_order/deleteOrder/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                // Show a success message
                Swal.fire({
                    icon: "success",
                    title: "Order Deleted",
                    text: "The order has been deleted successfully.",
                });

                // Fetch and update the data in the table
                fetchWholeSaleOrders();
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
                text: error.response.data.message,
            });
        }
    };

    const handleOpenOrderDetails = (orderId) => {
        fetchOrderDetails(orderId);
        setOrderIDSelected(orderId);
    };
    const handleCloseOrderDetails = () => {
        setOrderDetailsModalOpen(false);
    };

    const handleAddOrderDetails = () => {
        // Create a new order details object and add it to the array

        setAddingOrder(true);
        // Clear the input fields
        fetchWatches();
        setQuantity('');
        setPrice('');
    };



    const handleSaveOrderDetails = async () => {
        fetchWatches();
        try {
            // Call the API to save order details
            const token = getCookie("tokenAdmin");
            if (!token) {
                navigate("/admin/signin");
                return;
            }

            if (!selectedWatch ||!quantity ||!price ) {
                // Show a SweetAlert notification for missing date range
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Please fill in all information",
                });
                return;
            }

            const response = await API.post(`/wholesale_order/addOrderDetail/${orderIDSelected}`, {
                watchId: selectedWatch.MaDH,
                quantity,
                price,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Order Details Added",
                    text: "The order details have been added successfully.",
                });
                setOrderDetailsModalOpen(false); // Close the order details modal
                fetchOrderDetails(orderIDSelected); // Refresh the order details grid
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
                text: error.response.data.message,
            });
        }
    };
    const handleCancelDetail = () => {
        // Reset the form and hide the input fields when the user cancels
        setWatchID('');
        setQuantity('');
        setPrice('');
        setAddingOrder(false);
    };

    const handleDeleteDetail = async (orderId, watchId) => {
        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }

        try {
            const response = await API.delete(`/wholesale_order/deleteOrderDetail/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    watchId: watchId,
                },
            });

            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Order Detail Deleted",
                    text: "The order detail has been deleted successfully.",
                });
                fetchOrderDetails(orderIDSelected);
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
                text: error.response.data.message,
            });
        }
    };

    const fetchWatches = async () => {
        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }
        try {
            const response = await API.get('/watch/getAllWatches');

            if (response.data.success) {
                setWatchOptions(response.data.watches);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            {/* Main Orders Table */}
            <Modal open={open} onClose={onClose} style={{ zIndex: 4 }}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 800,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        outline: 'none',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                        <h2>Supplier Purchase Order</h2>
                        {addingOrder ? (
                            <div>
                                <Button style={{ backgroundColor: "black", color: "white", marginRight: "10px" }} onClick={handleAddOrder}>
                                    Save
                                </Button>
                                <Button onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <Button
                                style={{ backgroundColor: "black", color: "white", marginRight: "10px" }}
                                onClick={() => setAddingOrder(true)}
                            >
                                +ADD Supplier Purchase Order
                            </Button>
                        )}
                    </div>
                    {addingOrder && (
                        <div>
                            <TextField
                                style={{ marginBottom: "60px" }}
                                label="Order ID"
                                value={orderID}
                                onChange={(e) => setOrderID(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                        </div>
                    )}

                    <DataGrid
                        style={{ minHeight: '50vh', maxHeight: '50vh' }}
                        rows={wholeSaleOrders}
                        columns={[
                            { field: 'MaDDH', headerName: 'Order ID', flex: 1 },
                            { field: 'NgayDatHang', headerName: 'Order Date', flex: 1, valueGetter: (params) => formatDate(params.value) },
                            {
                                field: 'danhap',
                                headerName: '',
                                flex: 1,
                                renderCell: (params) => <ReceivedCell value={params.value} orderId={params.row.MaDDH} />,
                            },
                            {
                                field: 'options',
                                headerName: '',
                                width: 10,
                                renderCell: (params) => (
                                    <OptionsCell
                                        onDelete={() => handleDelete(params.row.MaDDH)}
                                        onWholeSaleOrderDetail={() => handleOpenOrderDetails(params.row.MaDDH)}
                                    />
                                ),
                            },
                        ]}
                    />
                </Box>
            </Modal>

            {/* Order Details Modal */}
            <Modal open={orderDetailsModalOpen} onClose={handleCloseOrderDetails} style={{ zIndex: 6 }}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 900,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        outline: 'none',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                        <h2>Supplier Purchase Order Detail</h2>
                        {addingOrder ? (
                            <div>
                                <Button style={{ backgroundColor: "black", color: "white", marginRight: "10px" }} onClick={handleSaveOrderDetails}>
                                    Save
                                </Button>
                                <Button onClick={handleCancelDetail}>
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <Button
                                style={{ backgroundColor: "black", color: "white", marginRight: "10px" }}
                                onClick={handleAddOrderDetails}
                            >
                                + ADD Supplier Purchase Order Detail
                            </Button>
                        )}
                    </div>
                    {addingOrder && (
                        <div>

                            <Autocomplete
                                options={watchOptions}
                                getOptionLabel={(option) => option.MaDH + "-" + option.TenDH}
                                value={selectedWatch}
                                onChange={(event, newValue) => setSelectedWatch(newValue)}
                                renderInput={(params) => <TextField {...params} label="Select Watch" />}
                                style={{ marginBottom: "15px" }}
                            />
                            <div>
                                <TextField
                                    style={{ marginBottom: "30px" }}
                                    label="Quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    
                                    margin="normal"
                                />
                                <TextField
                                    style={{ marginBottom: "30px",marginLeft: "30px" }}
                                    label="Price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    
                                    margin="normal"
                                />
                            </div>

                        </div>
                    )}

                    <DataGrid
                        style={{ minHeight: '50vh', maxHeight: '50vh' }}
                        rows={orderDetails}
                        columns={[
                            { field: 'MaDH', headerName: 'Watch ID', flex: 1 },
                            { field: 'SoLuong', headerName: 'Wantity', flex: 1 },
                            { field: 'DonGia', headerName: 'Price', flex: 1 },
                            {
                                field: 'options',
                                headerName: '',
                                width: 10,
                                renderCell: (params) => (
                                    <OptionsCell
                                        onDelete={() => handleDeleteDetail(orderIDSelected, params.row.MaDH)}
                                    />
                                ),
                            },
                        ]}
                    />

                </Box>
            </Modal>



            <Modal open={showNoteModal} onClose={handleCancelNoteModal} style={{ zIndex: 8 }}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        outline: 'none',
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Enter Note ID
                    </Typography>
                    <TextField
                        label="Note ID"
                        value={noteId}
                        onChange={(e) => setNoteId(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button style={{ backgroundColor: 'black', color: 'white' }} onClick={handleConfirmReceiptApi}>
                            Confirm
                        </Button>
                        <Button onClick={handleCancelNoteModal}>
                            Cancel
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default WholeSaleOrderModal;
