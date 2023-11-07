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
import  sanitizeSearchQuery  from '../utils/sanitizeSearchQuery';

const TableBrand = ({ onBrandSelected }) => {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRows, setFilteredRows] = useState([]);
    const [selectedMaHangs, setSelectedMaHangs] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null); //

    const [newBrand, setNewBrand] = useState({
        MaHang: '',
        TenHang: '',
        MoTa: ''
    });

    const columns = [
        { field: 'MaHang', headerName: 'Brand ID', flex: 1 },
        { field: 'TenHang', headerName: 'Watch Name', flex: 1 },

        {
            field: 'options',
            headerName: '',
            width: 10,
            renderCell: (params) => (
                <OptionsCell
                    onEdit={() => handleEditBrand(params.row)}
                    onDelete={() => handleDeleteBrand(params.row.MaHang)}
                />
            ),
        },
    ];

    const handleEditBrand = (brand) => {
        setEditingBrand(brand); // Lưu thông tin thương hiệu đang chỉnh sửa vào state
        setOpenModal(true); // Mở modal
    };
    const handleBrandEditSubmit = async (event) => {
        event.preventDefault();

        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }

        try {
            // Gửi yêu cầu chỉnh sửa thông tin thương hiệu
            const response = await API.put(
                `/watch/updateBrand/${editingBrand.MaHang}`,
                editingBrand,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Brand Updated",
                    text: "The brand has been updated successfully.",
                });
                setOpenModal(false); // Đóng modal sau khi lưu thành công
                fetchBrands(); // Refresh danh sách thương hiệu sau khi chỉnh sửa thành công
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

    const handleAddBrand = async () => {
        setOpenModal(true);
        setEditingBrand(null); // Reset thông tin của hãng cũ khi thêm hãng mới
        setNewBrand({
            MaHang: "",
            TenHang: "",
            MoTa: "",
        });
    };


    const handleBrandAddSubmit = async (event) => {
        event.preventDefault();

        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }

        if (!newBrand.MaHang || !newBrand.TenHang ) {
            // Show a SweetAlert notification for missing date range
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Please fill in all information",
            });
            return;
          }
        try {
            // Gửi yêu cầu thêm mới thông tin thương hiệu
            const response = await API.post(
                `/watch/addBrand`,
                newBrand,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Brand Added",
                    text: "The brand has been added successfully.",
                });
                setOpenModal(false); // Đóng modal sau khi thêm thành công
                fetchBrands(); // Refresh danh sách thương hiệu sau khi thêm thành công
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


    const handleDeleteBrand = async (brandId) => {
        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }

        // Show a confirmation prompt before deleting the brand
        const confirmationResult = await Swal.fire({
            icon: "warning",
            title: "Are you sure?",
            text: "This action will delete the brand. This cannot be undone.",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (confirmationResult.isConfirmed) {
            try {
                const response = await API.delete(
                    `/watch/deleteBrand/${brandId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Brand Deleted",
                        text: "The brand has been deleted successfully.",
                    });
                    fetchBrands(); // Refresh the brand list after successful deletion
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
        }
    };

    const handleRowClickBrand = (params) => {
        const maHang = params.row.MaHang;
        if (selectedMaHangs.includes(maHang)) {
            setSelectedMaHangs(selectedMaHangs.filter((selectedMa) => selectedMa !== maHang));
        } else {
            setSelectedMaHangs([...selectedMaHangs, maHang]);
        }
    };

    useEffect(() => {
        onBrandSelected(selectedMaHangs); // Update the selectedMaHangs whenever it changes
    }, [selectedMaHangs, onBrandSelected]);



    const fetchBrands = async () => {
        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }
        try {
            const response = await API.get('/watch/getAllBrands');

            if (response.data.success) {
                const brands = response.data.brands;

                const brandsWithId = brands.map((brand) => ({
                    ...brand,
                    id: brand.MaHang,
                }));
                setRows(brandsWithId);
                setFilteredRows(brandsWithId);

            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            // navigate("/admin/signin");
        }
    };


    useEffect(() => {
        fetchBrands();
    }, []);

    useEffect(() => {
        const sanitizedQuery = sanitizeSearchQuery(searchQuery.toLowerCase());
    
        const filteredRows = rows.filter((row) => {
            const watchName = row.TenHang.toLowerCase();
            const brandID = row.MaHang.toLowerCase();
            return watchName.includes(sanitizedQuery) || brandID.includes(sanitizedQuery);
        });
    
        setFilteredRows(filteredRows);
    }, [searchQuery, rows]);

    return (
        <div >
            <Box display="flex" alignItems="center" justifyContent="space-between" style={{ marginBottom: "20px" }}>
                <TextField
                    label="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "30%" }}
                />
                <Button variant="contained" color="primary" style={{ backgroundColor: 'black' }} onClick={handleAddBrand}>
                    + Add Brand
                </Button>

            </Box>
            <div style={{ width: '100%' }} >
                <DataGrid
                    style={{ minHeight: '38vh', maxHeight: '38vh' }}
                    rows={filteredRows}
                    columns={columns.map((column) => ({
                        ...column,
                        disableClickEventBubbling: true, // Disable clicking on the cell to prevent row selection
                    }))}
                    onRowClick={handleRowClickBrand}
                    rowSelected={(params) => selectedMaHangs.includes(params.row.MaHang)}
                    checkboxSelection
                    onSelectionModelChange={(newSelection) => {
                        setSelectedMaHangs(newSelection.selectionModel);
                    }}
                    className="hide-checkbox"
                />
            </div>

             <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
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
                        outline: "none", // Remove default outline around modal
                    }}
                >
                    {editingBrand ? (
                        // Hiển thị form chỉnh sửa thông tin hãng
                        <div>
                            <h2>Edit Brand</h2>
                            <form onSubmit={handleBrandEditSubmit}>
                            <TextField
                                    label="Brand ID"
                                    value={editingBrand.MaHang}
                                    onChange={(e) =>
                                        setEditingBrand((prev) => ({
                                            ...prev,
                                            MaLoai: e.target.value,
                                        }))
                                    }
                                    fullWidth
                                    margin="normal"
                                    disabled
                                />
                                <TextField
                                    label="Brand Name"
                                    value={editingBrand.TenHang}
                                    onChange={(e) =>
                                        setEditingBrand((prev) => ({
                                            ...prev,
                                            TenHang: e.target.value,
                                        }))
                                    }
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Description"
                                    multiline
                                    value={editingBrand.MoTa}
                                    onChange={(e) =>
                                        setEditingBrand((prev) => ({
                                            ...prev,
                                            MoTa: e.target.value,
                                        }))
                                    }
                                    fullWidth
                                    margin="normal"
                                    minRows={3}
                                />
                                {/* Add other fields for editing the brand */}
                                <Box display="flex" justifyContent="flex-end" mt={2}>
                                    <Button type="submit"   style={{backgroundColor: "black" , color:  "white",}}>Save</Button>
                                </Box>
                            </form>
                        </div>
                    ) : (
                        // Hiển thị form thêm hãng mới
                        <div>
                            <h2>Add Brand</h2>
                            <form onSubmit={handleBrandAddSubmit}>
                                <TextField
                                    label="Brand ID"
                                    value={newBrand.MaHang}
                                    onChange={(e) => setNewBrand({ ...newBrand, MaHang: e.target.value })}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Brand Name"
                                    value={newBrand.TenHang}
                                    onChange={(e) => setNewBrand({ ...newBrand, TenHang: e.target.value })}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                label="Description"
                             
                                    multiline
                                    value={newBrand.MoTa}
                                    onChange={(e) => setNewBrand({ ...newBrand, MoTa: e.target.value })}
                                    fullWidth
                                    margin="normal"
                                    minRows={3}
                                />
                                <Box display="flex" justifyContent="flex-end" mt={2}>
                                    <Button type="submit" style={{backgroundColor: "black" , color:  "white",}}>Save</Button>
                                </Box>
                            </form>
                        </div>
                    )}
                </Box>
            </Modal>



        </div>
    );
};

export default TableBrand;
