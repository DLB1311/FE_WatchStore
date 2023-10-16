import React, { useState, useEffect } from "react";
import API from '../services/api';
import getCookie from '../utils/getCookie';
import { useNavigate } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import OptionsCell from '../utils/OptionsCell';
import TextField from '@mui/material/TextField';
import urlImg from "../services/urlImg";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import '../css/adminform.css';
import Swal from "sweetalert2";
import Modal from '@mui/material/Modal';
import sanitizeSearchQuery from '../utils/sanitizeSearchQuery';
import formatDate from "../utils/formatDate";
import { DatePicker, Space } from 'antd';
import Autocomplete from '@mui/material/Autocomplete';
import dayjs from 'dayjs';

import customParseFormat from 'dayjs/plugin/customParseFormat';



dayjs.extend(customParseFormat);
const dateFormat = 'DD/MM/YYYY';

const TableStaff = () => {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRows, setFilteredRows] = useState([]);

    const [openModal, setOpenModal] = useState(false);
    const [openModalDetail, setOpenModalDetail] = useState(false);

    const [newDiscount, setNewDiscount] = useState({
        TenDotKM: '',
        NgayBatDau: '',
        NgayKetThuc: '',
        MoTa: ''
    });
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [selectedDiscountDetail, setSelectedDiscountDetail] = useState(null);

    const [searchQueryDiscountDetail, setSearchQueryDiscountDetail] = useState('');
    const [filteredDiscountDetailRows, setFilteredDiscountDetailRows] = useState([]);

    const [selectedMaDotKM, setSelectedMaDotKM] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [selectedWatch, setSelectedWatch] = useState(null);
    const [watchOptions, setWatchOptions] = useState([]);

    const [showAddWatchFields, setShowAddWatchFields] = useState(false);

    const [editingDiscountDetail, setEditingDiscountDetail] = useState(null);

    const columns = [
        { field: 'MaDotKM', headerName: 'Discount ID', flex: 1 },
        { field: 'TenDotKM', headerName: 'Name', flex: 1 },
        {
            field: 'NgayBatDau',
            headerName: 'Date Start',
            flex: 1,
            valueGetter: (params) => formatDate(params.value), // Định dạng ngày bắt đầu
        },
        {
            field: 'NgayKetThuc',
            headerName: 'Date End',
            flex: 1,
            valueGetter: (params) => formatDate(params.value), // Định dạng ngày kết thúc
        },

        {
            field: 'options',
            headerName: '',
            width: 10,
            renderCell: (params) => (
                <OptionsCell
                    onEdit={() => handleEditDiscount(params.row)}
                    onDelete={() => handleDeleteDiscount(params.row.MaDotKM)}
                    onCusDiscount={() => handleOpenModalDiscountDetail(params.row)}
                />
            ),
        },
    ];

    const handleOpenModal = () => {
        setOpenModal(true);
        setSelectedDiscount(null);
        setNewDiscount({
            TenDotKM: '',
            NgayBatDau: '',
            NgayKetThuc: '',
            MoTa: ''
        });

    };
    const handleCloseModal = () => {
        setOpenModal(false);

    };
    
    const handleAddDiscountSubmit = async (event) => {
        event.preventDefault();

        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }

        try {
            // Gửi dữ liệu mới đến server
            const response = await API.post(
                '/management/createDiscount',
                {
                    TenDotKM: newDiscount.TenDotKM,
                    NgayBatDau: newDiscount.NgayBatDau,
                    NgayKetThuc: newDiscount.NgayKetThuc,
                    MoTa: newDiscount.MoTa,
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
                handleCloseModal(); // Đóng modal
                fetchDiscounts(); // Cập nhật danh sách đợt khuyến mãi
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

    const handleEditDiscount = (discount) => {
        setSelectedDiscount(discount);
        setOpenModal(true);

        setNewDiscount({
            MaDotKM: discount.MaDotKM,
            TenDotKM: discount.TenDotKM,
            NgayBatDau: dayjs(discount.NgayBatDau), // Format date
            NgayKetThuc: dayjs(discount.NgayKetThuc),
            MoTa: discount.MoTa,
        });
    };
    const handleEditDiscountSubmit = async (event) => {
        event.preventDefault();

        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }

        try {
            // Gửi dữ liệu cập nhật đến server
            const response = await API.put(
                '/management/updateDiscount',
                {
                    MaDotKM: selectedDiscount.MaDotKM,
                    TenDotKM: newDiscount.TenDotKM,
                    NgayBatDau: newDiscount.NgayBatDau,
                    NgayKetThuc: newDiscount.NgayKetThuc,
                    MoTa: newDiscount.MoTa,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                // Hiển thị thông báo cập nhật thành công và cập nhật danh sách đợt khuyến mãi
                Swal.fire({
                    icon: "success",
                    title: "Discount Updated",
                    text: "The discount has been updated successfully.",
                });
                handleCloseModal(); // Đóng modal
                fetchDiscounts(); // Cập nhật danh sách đợt khuyến mãi
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

    const handleDeleteDiscount = async (MaDotKM) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (!confirmDelete.isConfirmed) {
            return;
        }

        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }

        try {
            // Send a request to delete the discount with the provided MaDotKM
            const response = await API.delete(`/management/deleteDiscount/${MaDotKM}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Discount Deleted",
                    text: "The discount has been deleted successfully.",
                });
                fetchDiscounts(); // Refresh the discounts list after deletion
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

    const fetchDiscountDetails = async (discount) => {
        try {
            const token = getCookie("tokenAdmin");
            if (!token) {
                navigate("/admin/signin");
                return;
            }

            const response = await API.get(`/management/getDiscountDetails/${discount.MaDotKM}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                const discounts = response.data.discount;
                const discountsdetailWithId = discounts.map((discount) => ({
                    ...discount,
                    id: discount.MaDH,
                }));

                return discountsdetailWithId;
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
            return [];
        }
    };
    const fetchDiscounts = async () => {
        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }
        try {
            const response = await API.get('/management/getAllDiscounts', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                const discounts = response.data.discountList;

                const discountsWithId = discounts.map((discount) => ({
                    ...discount,
                    id: discount.MaDotKM,
                }));
                setRows(discountsWithId);
                setFilteredRows(discountsWithId);

            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            // navigate("/admin/signin");
        }
    };
    const fetchWatchesWithoutDiscounts = async (discountDetail) => {
        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }
        try {
            const response = await API.get(`/management/getWatchesWithoutDiscounts/${discountDetail.MaDotKM}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setWatchOptions(response.data.watchesWithoutDiscounts);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenModalDiscountDetail = async (discount) => {
        const discountDetails = await fetchDiscountDetails(discount);
        setSelectedDiscountDetail(discountDetails);

        setEditingDiscountDetail(null);
        setOpenModalDetail(true);

        fetchWatchesWithoutDiscounts(discount);
        setSelectedMaDotKM(discount);

        setSelectedWatch(null);
        setDiscountPercentage('');
    };

    const handleShowAddWatch = () => {
        setShowAddWatchFields(true);
        setEditingDiscountDetail(null);
        setSelectedWatch(null);
        setDiscountPercentage('');
    };

    const handleCancelAddWatch = () => {
        setShowAddWatchFields(false);
        setSelectedWatch(null);
        setDiscountPercentage('');
    };

    const handleAddWatchSubmit = async (event) => {
        event.preventDefault();

        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }
        try {
            const response = await API.post(
                'management/addDiscountDetails',
                {
                    MaDotKM: selectedMaDotKM.MaDotKM,
                    MaDH: selectedWatch.MaDH,
                    GiamGia: parseFloat(discountPercentage),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Watch Added",
                    text: "The watch has been added to the discount successfully.",
                });

                const updatedDiscountDetails = await fetchDiscountDetails(selectedMaDotKM);
                setSelectedDiscountDetail(updatedDiscountDetails);
                setShowAddWatchFields(false);
                fetchWatchesWithoutDiscounts(selectedMaDotKM);


                setSelectedWatch(null);
                setDiscountPercentage('');
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

    const handleEditDiscountDetail = (discountDetail) => {
        setEditingDiscountDetail(discountDetail);
        setOpenModalDetail(true);
        setShowAddWatchFields(false);
        fetchWatchesWithoutDiscounts(discountDetail)
    };

    const handleUpdateDiscountDetail = async () => {
        if (!editingDiscountDetail) return;

        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }

        try {
            const response = await API.put(
                'management/updateDiscountPercentage',
                {
                    MaDotKM: editingDiscountDetail.MaDotKM,
                    MaDH: editingDiscountDetail.MaDH,
                    PhanTramGiam: parseFloat(editingDiscountDetail.PhanTramGiam),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Discount Detail Updated",
                    text: "The discount detail has been updated successfully.",
                });
                const updatedDiscountDetails = await fetchDiscountDetails(selectedMaDotKM);
                setSelectedDiscountDetail(updatedDiscountDetails);

                setEditingDiscountDetail(null);
                setDiscountPercentage('');
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

    const handleDeleteDiscountDetail = async (discountDetail) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (!confirmDelete.isConfirmed) {
            return;
        }

        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }

        try {
            // Send a request to delete the discount detail with the provided MaDotKM and MaDH
            const response = await API.delete('/management/deleteDiscountDetail', {
                data: {
                    MaDotKM: discountDetail.MaDotKM,
                    MaDH: discountDetail.MaDH,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Discount Detail Deleted",
                    text: "The discount detail has been deleted successfully.",
                });
                const updatedDiscountDetails = await fetchDiscountDetails(selectedMaDotKM);
                setSelectedDiscountDetail(updatedDiscountDetails);
                fetchWatchesWithoutDiscounts(selectedMaDotKM);

                fetchWatchesWithoutDiscounts(discountDetail);
                fetchDiscountDetails(discountDetail);
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

    const handleCancelEditDiscountDetail = () => {
        setEditingDiscountDetail(null);
        setDiscountPercentage('');
    };

    useEffect(() => {
        fetchDiscounts();
    }, []);

    useEffect(() => {
        const sanitizedQuery = sanitizeSearchQuery(searchQuery.toLowerCase());

        const filteredRows = rows.filter((row) => {
            const MaDotKM = row.MaDotKM.toString().toLowerCase();
            const TenDotKM = row.TenDotKM.toLowerCase();
            return MaDotKM.includes(sanitizedQuery) || TenDotKM.includes(sanitizedQuery);
        });

        setFilteredRows(filteredRows);
    }, [searchQuery, rows]);


    const handleDateChange = (dates) => {
        if (dates && dates.length === 2) {
            setNewDiscount({
                ...newDiscount,
                NgayBatDau: dates[0], // Format date
                NgayKetThuc: dates[1],
            });
        }
    };

    useEffect(() => {
        const sanitizedQuery = sanitizeSearchQuery(searchQueryDiscountDetail.toLowerCase());

        if (selectedDiscountDetail) {
            const filteredDiscountDetails = selectedDiscountDetail.filter((discount) => {
                const MaDH = discount.MaDH.toString().toLowerCase();
                const TenDh = discount.TenDh.toLowerCase();
                return MaDH.includes(sanitizedQuery) || TenDh.includes(sanitizedQuery);
            });

            setFilteredDiscountDetailRows(filteredDiscountDetails);
        }
    }, [searchQueryDiscountDetail, selectedDiscountDetail]);
    return (
        <div>
            <Box display="flex" alignItems="center" justifyContent="space-between" style={{ marginBottom: "20px" }}>
                <TextField
                    label="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "30%" }}
                />
                <Button variant="contained" color="primary" style={{ backgroundColor: 'black' }} onClick={handleOpenModal}>
                    + Add Discount
                </Button>
            </Box>
            <div style={{ width: '100%' }} >
                <DataGrid
                    style={{ minHeight: '50vh', maxHeight: '50vh' }}
                    rows={filteredRows}
                    columns={columns.map((column) => ({
                        ...column,
                        disableClickEventBubbling: true,
                    }))}
                />
            </div>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
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
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        outline: "none",
                    }}>

                    <h2 style={{ marginBottom: "45px" }} >{selectedDiscount ? "Edit Discount" : "Add Discount"}</h2>
                    <form onSubmit={selectedDiscount ? handleEditDiscountSubmit : handleAddDiscountSubmit}>
                        {selectedDiscount && (
                            <TextField
                                label="Discount ID"
                                value={selectedDiscount.MaDotKM}
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                style={{ marginBottom: "30px" }}
                            />
                        )}
                        <TextField
                            label="Discount Name"
                            value={newDiscount.TenDotKM}
                            onChange={(e) => setNewDiscount({ ...newDiscount, TenDotKM: e.target.value })}
                            fullWidth
                            style={{ marginBottom: "30px" }}
                        />

                        <Space direction="vertical" size={12} style={{ width: "100%" }} >
                            <DatePicker.RangePicker
                                value={[
                                    newDiscount.NgayBatDau,
                                    newDiscount.NgayKetThuc,
                                ]}
                                onChange={handleDateChange}
                                format={dateFormat}
                                style={{ marginBottom: "30px", width: "100%" }}
                            />
                        </Space>

                        <TextField
                            label="Description"
                            value={newDiscount.MoTa}
                            onChange={(e) => setNewDiscount({ ...newDiscount, MoTa: e.target.value })}
                            fullWidth
                            style={{ marginBottom: "30px" }}
                        />
                        <Box display="flex" justifyContent="flex-end" mt={2}>
                            <Button type="submit" style={{ backgroundColor: "black", color: "white", marginRight: "10px" }}>
                                {selectedDiscount ? "Update Discount" : "Add Discount"}
                            </Button>
                        </Box>


                    </form>
                </Box>

            </Modal>

            <Modal
                open={openModalDetail}
                onClose={() => setOpenModalDetail(false)}
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
                        outline: "none", // Remove default outline around modal
                    }}>
                    <div style={{ display: 'flex', justifyContent: "space-between", marginBottom: "30px" }}>
                        <h2>Discount Details</h2>

                        <Button variant="contained" color="primary" style={{ backgroundColor: 'black' }} onClick={handleShowAddWatch}>
                            + Add Watch
                        </Button>


                    </div>

                    {editingDiscountDetail && (
                        <div>

                            <TextField
                                label="Watch ID"
                                value={editingDiscountDetail.MaDH}
                                onChange={(e) => setDiscountPercentage(e.target.value)}
                                fullWidth
                                style={{ marginBottom: "30px" }}
                                disabled
                            />

                            <TextField
                                label="Discount Percentage"
                                value={editingDiscountDetail.PhanTramGiam}
                                onChange={(e) => setEditingDiscountDetail({ ...editingDiscountDetail, PhanTramGiam: e.target.value })}
                                fullWidth
                                style={{ marginBottom: "30px" }}
                            />
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>

                                <Button variant="contained" color="primary" style={{ backgroundColor: "black", color: "white", marginRight: "10px" }} onClick={handleUpdateDiscountDetail}>
                                    Save
                                </Button>
                                <Button variant="contained" color="secondary" style={{ backgroundColor: "white", color: "black", border: "1px solid black" }} onClick={handleCancelEditDiscountDetail}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    {showAddWatchFields && (
                        <div>
                            <Autocomplete
                                options={watchOptions}
                                getOptionLabel={(option) => option.MaDH + "-" + option.TenDH}
                                value={selectedWatch}
                                onChange={(event, newValue) => setSelectedWatch(newValue)}
                                renderInput={(params) => <TextField {...params} label="Select Watch" />}
                                style={{ marginBottom: "15px" }}
                            />
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddWatchSubmit}
                                    style={{ backgroundColor: "black", color: "white", marginRight: "10px" }}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleCancelAddWatch}
                                    style={{ backgroundColor: "white", color: "black", border: "1px solid black" }}
                                >
                                    Cancel
                                </Button>
                            </div>

                        </div>
                    )}

                    <TextField
                        label="Search Watches"
                        value={searchQueryDiscountDetail}
                        onChange={(e) => setSearchQueryDiscountDetail(e.target.value)}
                        style={{ width: "50%", marginBottom: "15px" }}
                    />

                    <DataGrid
                        // Display related information from CTKHUYENMAI table
                        rows={filteredDiscountDetailRows}
                        columns={[
                            { field: 'MaDH', headerName: 'Watch ID', flex: 1 },
                            { field: 'TenDh', headerName: 'Watch Name', flex: 1 },
                            { field: 'PhanTramGiam', headerName: 'Discount Percentage', flex: 1 },
                            {
                                field: 'options',
                                headerName: '',
                                width: 10,
                                renderCell: (params) => (
                                    <OptionsCell
                                        onEdit={() => handleEditDiscountDetail(params.row)}
                                        onDelete={() => handleDeleteDiscountDetail(params.row)}

                                    />
                                ),
                            },
                        ]}
                        style={{ minHeight: '400px', maxHeight: '400px' }}
                    />
                </Box>
            </Modal>
        </div>
    );
};

export default TableStaff;
