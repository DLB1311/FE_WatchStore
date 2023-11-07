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
import Autocomplete from '@mui/material/Autocomplete';
import formatDate from "../utils/formatDate";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const TableStaff = () => {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRows, setFilteredRows] = useState([]);

    const [openAddModal, setOpenAddModal] = useState(false);

    const [selectedRole, setSelectedRole] = useState(null);
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [gender, setGender] = useState(null);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [ngaySinh, setNgaySinh] = useState('');
    const [diaChi, setDiaChi] = useState('');
    const [password, setPassword] = useState('');
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);


    const handleOpenAddModal = () => {
        setOpenAddModal(true);
        setLastName('');
        setFirstName('');
        setGender(null);
        setPhone('');
        setEmail('');
        setNgaySinh('');
        setDiaChi('');
        setPassword('');
        setSelectedRole(null);

    };
    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    const [roles, setRoles] = useState([]);
    const fetchRoles = async () => {
        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }
        try {
            const response = await API.get('/staff/getAllRoleStaff', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setRoles(response.data.roleList);
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const columns = [
        { field: 'MaNV', headerName: 'Employee ID', flex: 0 },
        { field: 'Ho', headerName: 'Last Name', flex: 1 },
        { field: 'Ten', headerName: 'First Name', flex: 1 },
        { field: 'GioiTinh', headerName: 'Gender', flex: 1, valueGetter: (params) => params.value ? 'Male' : 'Female' },
        { field: 'NgaySinh', headerName: 'Date of Birth', flex: 0, valueGetter: (params) => formatDate(params.value) },
        { field: 'DiaChi', headerName: 'Address', flex: 1 },
        { field: 'SDT', headerName: 'Phone', flex: 1 },
        { field: 'Email', headerName: 'Email', flex: 1 },
        { field: 'TenQuyen', headerName: 'Vai trò', flex: 1 },
        {
            field: 'options',
            headerName: '',
            width: 10,
            renderCell: (params) => (
                <OptionsCell
                    onEdit={() => handleOpenEditModal(params.row)}
                    onDelete={() => handleDeleteStaff(params.row)}
                />
            ),
        },
    ];

    const fetchStaffs = async () => {
        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }
        try {
            const response = await API.get('/staff/getAllStaff', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                const staffs = response.data.staffList;

                const staffsWithId = staffs.map((staff) => ({
                    ...staff,
                    id: staff.MaNV,
                }));
                setRows(staffsWithId);
                setFilteredRows(staffsWithId);

            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            // navigate("/admin/signin");
        }
    };

    const handleOpenEditModal = (staff) => {
        setEditingStaff(staff);
        setOpenEditModal(true);

    };
    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setEditingStaff(null); // Reset the editingStaff state
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();

        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }

        if (!editingStaff.Ho || !editingStaff.Ten || !editingStaff.GioiTinh|| !editingStaff.NgaySinh|| !editingStaff.DiaChi|| !editingStaff.SDT|| !editingStaff.Email|| !editingStaff.MaQuyen) {
            // Show a SweetAlert notification for missing date range
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Please fill in all information",
            });
            return;
        }

        try {
            // Make an API request to update the staff member's information
            const response = await API.put(
                `/staff/updateStaffMember/${editingStaff.MaNV}`,
                {
                    Ho: editingStaff.Ho,
                    Ten: editingStaff.Ten,
                    GioiTinh: editingStaff.GioiTinh,
                    NgaySinh: editingStaff.NgaySinh,
                    DiaChi: editingStaff.DiaChi,
                    SDT: editingStaff.SDT,
                    Email: editingStaff.Email,
                    MaQuyen: editingStaff.MaQuyen,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                // Display success message and close the modal
                Swal.fire({
                    icon: "success",
                    title: "Staff Updated",
                    text: "The staff member's information has been updated successfully.",
                });
                handleCloseEditModal();
                fetchStaffs(); // Refresh the staff list
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

    const handleDeleteStaff = (staff) => {
        Swal.fire({
            title: 'Delete Staff',
            text: `Are you sure you want to delete the staff member ${staff.Ho} ${staff.Ten}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = getCookie('tokenAdmin');
                    if (!token) {
                        navigate('/admin/signin');
                        return;
                    }

                    const response = await API.delete(`/staff/deleteStaffMember/${staff.MaNV}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: `The staff member ${staff.Ho} ${staff.Ten} has been deleted.`,
                        });
                        fetchStaffs(); // Refresh the staff list
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
                        text: error.response.data.message,
                    });
                }
            }
        });
    };

    const handleStaffAddSubmit = async (event) => {
        event.preventDefault();

        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }

        if (!lastName || !firstName || !gender|| !ngaySinh|| !diaChi|| !phone|| !email|| !password|| !selectedRole) {
            // Show a SweetAlert notification for missing date range
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Please fill in all information",
            });
            return;
          }

        try {
            // Make an API request to add the new staff member
            const response = await API.post(
                'staff/addStaffMember',
                {
                    Ho: lastName,
                    Ten: firstName,
                    GioiTinh: gender,
                    NgaySinh: ngaySinh,
                    DiaChi: diaChi,
                    SDT: phone,
                    Email: email,
                    Password: password,
                    MaQuyen: selectedRole.MaQuyen,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                // Display success message and update staff list
                Swal.fire({
                    icon: "success",
                    title: "Staff Added",
                    text: "The staff member has been added successfully.",
                });
                handleCloseAddModal(); // Close the modal
                fetchStaffs(); // Refresh the staff list
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

    useEffect(() => {
        fetchRoles();
        fetchStaffs();
    }, []);


    useEffect(() => {
        const sanitizedQuery = sanitizeSearchQuery(searchQuery.toLowerCase());

        const filteredRows = rows.filter((row) => {
            const lastName = row.Ho.toLowerCase();
            const firstName = row.Ten.toLowerCase();
            const staffID = row.MaNV.toLowerCase();
            return lastName.includes(sanitizedQuery) || firstName.includes(sanitizedQuery) || staffID.includes(sanitizedQuery);
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
                <Button variant="contained" color="primary" style={{ backgroundColor: 'black' }} onClick={handleOpenAddModal} >
                    + Add Staff
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
                open={openAddModal}
                onClose={handleCloseAddModal}
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
                    }}
                >
                    <h2>Add Staff</h2>
                    <form onSubmit={handleStaffAddSubmit}>
                        <Box display="flex">
                            <TextField
                                label="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                fullWidth
                                margin="normal"
                                style={{ marginRight: "10px" }}
                            />
                            <TextField
                                label="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                        </Box>
                        <Box display="flex" >

                            <div style={{ marginRight: "10px", width: "100%" }} >
                                <p>Date of birth
                                </p>
                                <TextField

                                    type="date"
                                    value={ngaySinh}
                                    onChange={(e) => setNgaySinh(e.target.value)}

                                    fullWidth
                                />
                            </div>

                            <Autocomplete
                                id="gender-combobox"
                                fullWidth
                                options={[
                                    { label: 'Male', value: true },
                                    { label: 'Female', value: false },
                                ]}
                                value={gender}
                                onChange={(event, newValue) => {
                                    setGender(newValue);
                                }}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                    <TextField {...params} label="Gender" fullWidth margin="normal" />
                                )}
                            />

                        </Box>

                        <TextField
                            label="Phone"
                            type="number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Address"
                            value={diaChi}
                            onChange={(e) => setDiaChi(e.target.value)}
                            fullWidth
                            margin="normal"
                        />


                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Autocomplete
                            id="role-combobox"
                            options={roles}
                            getOptionLabel={(role) => role.TenQuyen}
                            value={selectedRole}
                            onChange={(event, newValue) => {
                                setSelectedRole(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Role" fullWidth margin="normal" />
                            )}
                        />
                        {/* Add other fields for adding staff */}
                        <Box display="flex" justifyContent="flex-end" mt={2}>
                            <Button type="submit"   style={{
                            backgroundColor: "black" ,
                            color:  "white",
                            
                          }}>Save</Button>
                        </Box>
                    </form>
                </Box>
            </Modal>


            <Modal
                open={openEditModal}
                onClose={handleCloseEditModal}
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
                    }}
                >
                    <h2>Edit Staff</h2>
                    <form onSubmit={handleEditSubmit}>
                        <TextField
                            label="Last Name"
                            value={editingStaff?.Ho || ""}
                            onChange={(e) => setEditingStaff({ ...editingStaff, Ho: e.target.value })}
                            fullWidth
                            margin="normal"
                            style={{ marginRight: "10px" }}
                        />
                        <TextField
                            label="First Name"
                            value={editingStaff?.Ten || ""}
                            onChange={(e) => setEditingStaff({ ...editingStaff, Ten: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        {/* Add other fields for editing staff */}
                        <p>Date of birth  </p>
                        <Box display="flex">

                            <div style={{ marginRight: "10px", width: "100%" }}>
                                
                                <TextField
                                    type="date"
                                    value={editingStaff?.NgaySinh ? editingStaff.NgaySinh.substring(0, 10) : ""}
                                    onChange={(e) =>
                                        setEditingStaff({
                                            ...editingStaff,
                                            NgaySinh: e.target.value + "T00:00:00.000Z",
                                        })
                                    }
                                    fullWidth
                                />
                            </div>

                            <Select
                                id="gender-combobox"
                                label="Gender"
                                fullWidth
                                value={editingStaff?.GioiTinh}
                                onChange={(event) => {
                                    const newGender = event.target.value;
                                    setEditingStaff({ ...editingStaff, GioiTinh: newGender });
                                }}
                                
                                renderInput={(params) => (
                                    <TextField {...params} label="Gender" fullWidth margin="normal" />
                                )}
                            >
                                <MenuItem value={true}>Male</MenuItem>
                                <MenuItem value={false}>Female</MenuItem>
                            </Select>
                        </Box>
                        <TextField
                            label="Phone"
                            value={editingStaff?.SDT || ""}
                            onChange={(e) => setEditingStaff({ ...editingStaff, SDT: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={editingStaff?.Email || ""}
                            onChange={(e) => setEditingStaff({ ...editingStaff, Email: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Address"
                            value={editingStaff?.DiaChi || ""}
                            onChange={(e) => setEditingStaff({ ...editingStaff, DiaChi: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <Autocomplete
                            id="role-combobox"
                            options={roles}
                            getOptionLabel={(role) => role.TenQuyen}
                            value={editingStaff?.MaQuyen ? roles.find(role => role.MaQuyen === editingStaff?.MaQuyen) : null}
                            onChange={(event, newValue) => {
                                setEditingStaff({ ...editingStaff, MaQuyen: newValue ? newValue.MaQuyen : null });
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Role" fullWidth margin="normal" />
                            )}
                        />

                        <Box display="flex" justifyContent="flex-end" mt={2} >
                            <Button type="submit"   style={{
                            backgroundColor: "black" ,
                            color:  "white",
                            
                          }}>Update</Button>
                        </Box>
                    </form>
                </Box>
            </Modal>

        </div>
    );
};

export default TableStaff;
