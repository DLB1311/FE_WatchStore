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
import OptionsCell from '../../utils/OptionsCell';

import TableDiscount from "../../components/TableDiscount";


const MangementSupplier = () => {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [showAddModal, setShowAddModal] = useState(false);
    const [newSupplierData, setNewSupplierData] = useState({
        MaNCC: "",
        TenNCC: "",
        DiaChi: "",
        Email: "",
        SDT: "",
    });

    const [editingSupplier, setEditingSupplier] = useState(null);
    const [editedSupplier, setEditedSupplier] = useState({
        MaNCC: '',
        TenNCC: '',
        DiaChi: '',
        Email: '',
        SDT: '',
    });

    const openAddModal = () => {
        setShowAddModal(true);
    };
    const closeAddModal = () => {
        setShowAddModal(false);
        // Clear input fields when modal is closed
        setNewSupplierData({
            MaNCC: "",
            TenNCC: "",
            DiaChi: "",
            Email: "",
            SDT: "",
        });
    };
    const handleInputFieldChange = (field, value) => {
        setNewSupplierData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);
    const fetchSuppliers = async () => {
        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }
        try {
            const response = await API.get('management/getAllSuppliers', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setSuppliers(response.data.suppliers);



            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.data.message,
                });
            }

            setLoading(false);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred while fetching suppliers.",
            });

            setLoading(false);
        }
    };

    const columns = [
        { field: 'MaNCC', headerName: 'Supplier ID', flex: 1 },
        { field: 'TenNCC', headerName: 'Supplier Name', flex: 1 },
        { field: 'DiaChi', headerName: 'Address', flex: 1 },
        { field: 'Email', headerName: 'Email', flex: 1 },
        { field: 'SDT', headerName: 'Phone', flex: 1 },
        {
            field: 'options',
            headerName: '',
            width: 10,
            renderCell: (params) => (
                <OptionsCell
                    onEdit={() => handleEditSupplier(params.row)}
                    onDelete={() => handleDeleteSupplier(params.row.MaNCC)}
                />
            ),
        },
    ];


    const handleAddSupplier = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }

        try {
            const response = await API.post('/management/addSupplier', newSupplierData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Supplier Added",
                    text: "The supplier has been added successfully.",
                });
                fetchSuppliers();
                closeAddModal(); // Close the modal after successful addition
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
    const handleEditSupplier = (supplier) => {
        setEditingSupplier(supplier);
        setEditedSupplier({
            MaNCC: supplier.MaNCC,
            TenNCC: supplier.TenNCC,
            DiaChi: supplier.DiaChi,
            Email: supplier.Email,
            SDT: supplier.SDT,
        });
    };
    const handleEditFieldChange = (field, value) => {
        setEditedSupplier((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };
    const handleEditSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
    
        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }
    
        try {
            const response = await API.put(`/management/editSupplier/${editingSupplier.MaNCC}`, editedSupplier, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Supplier Updated",
                    text: "The supplier has been updated successfully.",
                }).then(() => {
                    fetchSuppliers();
                    setEditingSupplier(null);
                });
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
    const handleDeleteSupplier = async (supplierId) => {
        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }

        const confirmation = await Swal.fire({
            icon: "warning",
            title: "Confirm Deletion",
            text: "Are you sure you want to delete this supplier?",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
        });

        if (confirmation.isConfirmed) {
            try {
                const response = await API.delete(`/management/deleteSupplier/${supplierId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Supplier Deleted",
                        text: "The supplier has been deleted successfully.",
                    });
                    fetchSuppliers(); // Refresh the supplier list after successful deletion
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


    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
    };
    const filteredSuppliers = suppliers.filter((supplier) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            supplier.MaNCC.toLowerCase().includes(searchLower) ||
            supplier.TenNCC.toLowerCase().includes(searchLower) ||
            supplier.DiaChi.toLowerCase().includes(searchLower) ||
            supplier.Email.toLowerCase().includes(searchLower) ||
            supplier.SDT.toLowerCase().includes(searchLower)
        );
    });
    const getRowId = (row) => row.MaNCC;

    return (

        <SideBar>
            <Box display="flex" flexDirection="row" height="100vh" width="80%" flex={1}>
                <Card variant="outlined" style={{ borderRadius: 7, margin: "5px", width: "100%" }}>
                    <CardContent>
                        <h1 style={{ marginBottom: "30px" }} >Supplier Management</h1>
                        <Box display="flex" alignItems="center" justifyContent="space-between" style={{ marginBottom: "20px" }}>
                            <TextField
                                label="Search"
                                value={searchQuery}
                                onChange={handleSearchQueryChange}
                                style={{ width: "30%" }}
                            />
                            <Button variant="contained" color="primary" style={{ backgroundColor: 'black' }} onClick={openAddModal}>
                                + Add Supplier
                            </Button>
                        </Box>
                        <DataGrid
                        style={{minHeight: '80vh', maxHeight: '38vh' }}
                            rows={filteredSuppliers}
                            columns={columns.map((column) => ({
                                ...column,
                                disableClickEventBubbling: true,
                            }))}
                            loading={loading}
                            components={{
                                NoRowsOverlay: () => loading ? <div>Loading...</div> : <div>No suppliers found.</div>,
                            }}
                            getRowId={getRowId}
                        />
                    </CardContent>
                </Card>
            </Box>

            <Modal open={showAddModal} onClose={closeAddModal} style={{ zIndex: 4 }}>
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4, outline: "none" }}>
                    <Typography variant="h6">Add Supplier</Typography>
                    <form onSubmit={handleAddSupplier}>
                        <TextField label="Supplier ID" value={newSupplierData.MaNCC} onChange={(e) => handleInputFieldChange("MaNCC", e.target.value)} fullWidth margin="normal" />
                        <TextField label="Supplier Name" value={newSupplierData.TenNCC} onChange={(e) => handleInputFieldChange("TenNCC", e.target.value)} fullWidth margin="normal" />
                        <TextField label="Address" value={newSupplierData.DiaChi} onChange={(e) => handleInputFieldChange("DiaChi", e.target.value)} fullWidth margin="normal" />
                        <TextField type="email" label="Email" value={newSupplierData.Email} onChange={(e) => handleInputFieldChange("Email", e.target.value)} fullWidth margin="normal" />
                        <TextField type="number" label="Phone" value={newSupplierData.SDT} onChange={(e) => handleInputFieldChange("SDT", e.target.value)} fullWidth margin="normal" />
                        <Box display="flex" justifyContent="flex-end" mt={2}>
                            <Button type="submit" style={{backgroundColor: "black" ,color:  "white"}}>Add Supplier</Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
            <Modal open={editingSupplier !== null} onClose={() => setEditingSupplier(null)} style={{ zIndex: 4 }}>
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4, outline: "none" }}>
                    <Typography variant="h6">Edit Supplier</Typography>
                    <form onSubmit={handleEditSubmit}>
                        <TextField label="Supplier ID" value={editedSupplier.MaNCC} disabled fullWidth margin="normal" />
                        <TextField label="Supplier Name" value={editedSupplier.TenNCC} onChange={(e) => handleEditFieldChange("TenNCC", e.target.value)} fullWidth margin="normal" />
                        <TextField label="Address" value={editedSupplier.DiaChi} onChange={(e) => handleEditFieldChange("DiaChi", e.target.value)} fullWidth margin="normal" />
                        <TextField type="email" label="Email" value={editedSupplier.Email} onChange={(e) => handleEditFieldChange("Email", e.target.value)} fullWidth margin="normal" />
                        <TextField type="number" label="Phone" value={editedSupplier.SDT} onChange={(e) => handleEditFieldChange("SDT", e.target.value)} fullWidth margin="normal" />
                        <Box display="flex" justifyContent="flex-end" mt={2}>
                            <Button type="submit" style={{backgroundColor: "black" ,color:  "white"}}>Save Changes</Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </SideBar>
    );
};

export default MangementSupplier;
