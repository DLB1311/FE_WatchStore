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
import Swal from "sweetalert2";
import Modal from '@mui/material/Modal';
import  sanitizeSearchQuery  from '../utils/sanitizeSearchQuery';

const TableType = ({ onTypeSelected }) => {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRows, setFilteredRows] = useState([]);
    const [selectedMaLoais, setSelectedMaLoais] = useState([]); 
    const [openModal, setOpenModal] = useState(false);
    const [editingType, setEditingType] = useState(null);

    const [newType, setNewType] = useState({
        MaLoai: '',
        TenLoai: '',
        MoTa: ''
    });
    const columns = [
        { field: 'MaLoai', headerName: 'Type ID', flex: 1 },
        { field: 'TenLoai', headerName: 'Type Name', flex: 1},

        {
            field: 'options',
            headerName: '',
            width: 10,
            renderCell: (params) => (
                <OptionsCell
                    onEdit={() => handleEditType(params.row)} 
                    onDelete={() => handleDeleteType(params.row.MaLoai)}
                />
            ),
        },
    ];

    const handleEditType = (type) => {
        setEditingType(type); // Lưu thông tin loại đang chỉnh sửa vào state
        setOpenModal(true); // Mở modal
    };
    const handleTypeSubmit = async (event) => {
        event.preventDefault();

        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }

        try {
            if (editingType) {
                // Gửi yêu cầu cập nhật thông tin loại
                const response = await API.put(
                    `/watch/updateType/${editingType.MaLoai}`,
                    editingType,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Type Updated",
                        text: "The type has been updated successfully.",
                    });
                    setOpenModal(false); // Đóng modal sau khi lưu thành công
                    fetchCategories(); // Refresh danh sách loại sau khi chỉnh sửa thành công
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: response.data.message,
                    });
                }
            } else {
                // Gửi yêu cầu thêm mới thông tin loại
                const response = await API.post(
                    `/watch/addType`,
                    newType,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Type Added",
                        text: "The type has been added successfully.",
                    });
                    setOpenModal(false); // Đóng modal sau khi thêm thành công
                    fetchCategories(); // Refresh danh sách loại sau khi thêm thành công
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: response.data.message,
                    });
                }
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

    const handleAddType = () => {
        setEditingType(null); // Reset thông tin của loại cũ khi thêm loại mới
        setOpenModal(true);
        setNewType({
            MaLoai: "",
            TenLoai: "",
            MoTa: "",
        });
    };

    const handleDeleteType= async (typeId) =>  {
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
              `/watch/deleteType/${typeId}`,
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
              fetchCategories(); // Refresh the brand list after successful deletion
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
    const handleRowClickType = (params) => {
        const maLoai = params.row.MaLoai;
        if (selectedMaLoais.includes(maLoai)) {
            setSelectedMaLoais(selectedMaLoais.filter((selectedMa) => selectedMa !== maLoai));
        } else {
            setSelectedMaLoais([...selectedMaLoais, maLoai]);
        }
    };
    useEffect(() => {
        onTypeSelected(selectedMaLoais); // Update the selectedMaHangs whenever it changes
    }, [selectedMaLoais, onTypeSelected]);


    const fetchCategories = async () => {
        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }
        try {
            const response = await API.get('/watch/getAllTypes');

            if (response.data.success) {
                const types = response.data.types;
                
                const typesWithId = types.map((type) => ({
                    ...type,
                    id: type.MaLoai,
                }));
                setRows(typesWithId);
                setFilteredRows(typesWithId);

            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            // navigate("/admin/signin");
        }
    };


    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const sanitizedQuery = sanitizeSearchQuery(searchQuery.toLowerCase());
    
        const filteredRows = rows.filter((row) => {
            const tenLoai = row.TenLoai.toLowerCase();
            const typeID = row.MaLoai.toLowerCase();
            return tenLoai.includes(sanitizedQuery) || typeID.includes(sanitizedQuery);
        });
    
        setFilteredRows(filteredRows);
    }, [searchQuery, rows]);
    return (
        <div>
            <Box display="flex" alignItems="center" justifyContent="space-between" style={{ marginBottom: "20px" }}>
                <TextField
                    label="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "30%" }}
                />
                <Button variant="contained" color="primary" style={{ backgroundColor: 'black' }} onClick={handleAddType}>
                + Add Type
            </Button>
            </Box>
            <div style={{ width: '100%' }} >
                <DataGrid
                    style={{minHeight: '38vh', maxHeight: '38vh' }}
                    rows={filteredRows}
                    columns={columns}
                    onRowClick={handleRowClickType}
                    className="hide-checkbox"
                    rowSelected={(params) => selectedMaLoais.includes(params.row.MaLoai)}
                    checkboxSelection
                    onSelectionModelChange={(newSelection) => {
                        setSelectedMaLoais(newSelection.selectionModel);
                    }}

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
                    {editingType ? (
                        // Hiển thị form chỉnh sửa thông tin loại
                        <div>
                            <h2>Edit Type</h2>
                            <form onSubmit={handleTypeSubmit}>
                                <TextField
                                    label="Type ID"
                                    value={editingType.MaLoai}
                                    onChange={(e) =>
                                        setEditingType((prev) => ({
                                            ...prev,
                                            MaLoai: e.target.value,
                                        }))
                                    }
                                    fullWidth
                                    margin="normal"
                                    disabled
                                />
                                <TextField
                                    label="Type Name"
                                    value={editingType.TenLoai}
                                    onChange={(e) =>
                                        setEditingType((prev) => ({
                                            ...prev,
                                            TenLoai: e.target.value,
                                        }))
                                    }
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Description"
                                    value={editingType.MoTa}
                                    onChange={(e) =>
                                        setEditingType((prev) => ({
                                            ...prev,
                                            MoTa: e.target.value,
                                        }))
                                    }
                                    fullWidth
                                    margin="normal"
                                    minRows={3}
                                />
                                {/* Add other fields for editing the type */}
                                <Box display="flex" justifyContent="flex-end" mt={2}>
                                    <Button type="submit" style={{backgroundColor: "black" , color:  "white",}}>Save</Button>
                                </Box>
                            </form>
                        </div>
                    ) : (
                        // Hiển thị form thêm loại mới
                        <div>
                            <h2>Add Type</h2>
                            <form onSubmit={handleTypeSubmit}>
                                <TextField
                                    label="Type ID"
                                    value={newType.MaLoai}
                                    onChange={(e) =>
                                        setNewType({ ...newType, MaLoai: e.target.value })
                                    }
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Type Name"
                                    value={newType.TenLoai}
                                    onChange={(e) =>
                                        setNewType({ ...newType, TenLoai: e.target.value })
                                    }
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Description"
                                    value={newType.MoTa}
                                    onChange={(e) =>
                                        setNewType({ ...newType, MoTa: e.target.value })
                                    }
                                    fullWidth
                                    margin="normal"
                                    minRows={3}
                                />
                                {/* Add other fields for adding a new type */}
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

export default TableType;
