import React, { useState, useEffect } from "react";
import API from '../services/api';
import getCookie from '../utils/getCookie';
import { useNavigate } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import OptionsCell from '../utils/OptionsCell';
import { Autocomplete, TextField } from "@mui/material";
import urlImg from "../services/urlImg";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Checkbox from '@mui/material/Checkbox';
import Swal from "sweetalert2";
import { Form, Upload, message } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import PriceHistoryModal  from './PriceHistoryModal';
import "../css/adminform.css"

const TableWatch = ({ selectedBrand, selectedType }) => {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRowswatch, setFilteredRowsWatch] = useState([]);
    const [editingWatch, setEditingWatch] = useState(null); //
    const [newWatch, setNewWatch] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [watchImage, setWatchImage] = useState(null);

    const [isStatusChecked, setStatusChecked] = useState(false);
    const [isNewChecked, setNewChecked] = useState(false);
    const [brandOptions, setBrandOptions] = useState([]);
    const [typeOptions, setTypeOptions] = useState([]);
    const [selectedBrandOption, setSelectedBrandOption] = useState(null);
    const [selectedTypeOption, setSelectedTypeOption] = useState(null);

    const [selectedBrandError, setSelectedBrandError] = useState(false);
    const [selectedTypeError, setSelectedTypeError] = useState(false);

    const [selectedEditBrandError, setSelectedEditBrandError] = useState(false);
    const [selectedEditTypeError, setSelectedEditTypeError] = useState(false);

    const [openPriceHistoryModal, setOpenPriceHistoryModal] = useState(false);
    const [selectedWatchId, setSelectedWatchId] = useState(null);

    const fetchBrandAndTypeOptions = async () => {
        try {
            const brandResponse = await API.get('/watch/getAllBrands');
            const typeResponse = await API.get('/watch/getAllTypes');

            if (brandResponse.data.success && typeResponse.data.success) {
                setBrandOptions(brandResponse.data.brands);
                setTypeOptions(typeResponse.data.types);
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchBrandAndTypeOptions();
    }, []);


    const WatchNameCell = ({ value }) => (
        <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', width: '100%' }}>
            {value}
        </div>
    );
    const NewCell = ({ value }) => (
        <div
            style={{
                display: 'inline-block',
                backgroundColor: value ? '#f1c40f' : 'transparent',
                padding: '2px 6px',
                borderRadius: '4px',
                color: value ? 'white' : 'inherit',
            }}
        >
            {value ? 'New' : ''}
        </div>
    );
    const StatusCell = ({ value }) => (
        <div
            style={{
                display: 'inline-block',
                backgroundColor: value ? '#32CD32' : 'red',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
            }}
        />
    );
    const columns = [
        { field: 'HinhAnh', headerName: 'Image', flex: 1, renderCell: (params) => <img src={urlImg + params.value} alt={params.row.TenDH} style={{ maxHeight: '60%', objectFit: 'cover' }} /> },
        { field: 'MaDH', headerName: 'Watch ID', flex: 0 },
        { field: 'TenDH', headerName: 'Watch Name', flex: 3, renderCell: (params) => <WatchNameCell value={params.value} /> },
        { field: 'TenLoai', headerName: 'Category', flex: 2 },
        { field: 'TenHang', headerName: 'Brand', flex: 2 },
        { field: 'SoLuongTon', headerName: 'Quantity', flex: 0 },
        {
            field: 'GiaSauKhuyenMai',
            headerName: 'Price',
            flex: 1,
            renderCell: (params) => (
              <span>{parseFloat(params.value).toLocaleString()}</span>
            ),
        },
        {
            field: 'GiaGoc',
            headerName: 'Price',
            flex: 1,
            renderCell: (params) => (
              <span>{parseFloat(params.value).toLocaleString()}</span>
            ),
        },
        {
            field: 'TrangThai',
            headerName: '',
            width: 30,
            renderCell: (params) => <StatusCell value={params.value} />,
        },
        {
            field: 'is_new',
            headerName: '',
            width: 30,
            renderCell: (params) => <NewCell value={params.value} />,
        },
        {
            field: 'options',
            headerName: '',
            width: 10,
            renderCell: (params) => (
                <OptionsCell
                    onEdit={() => handleEditWatch(params.row)}
                    onDelete={() => handleDeleteWatch(params.row)}
                    onCustom={() => handleEditPrice(params.row)}
                />
            ),
        },
    ];

    const handleAddWatch = async () => {
        setOpenModal(true);
        setEditingWatch(null);
        setNewWatch({
            MaDH: '',
            TenDH: '',
            SoLuongTon: '',
            MoTa: '',
        });
        setStatusChecked(false);
        setNewChecked(false);
        setSelectedTypeOption(null);
        setSelectedBrandOption(null);
        setWatchImage(null);
        setSelectedBrandError(false);
        setSelectedTypeError(false);

    };
    const handleWatchAddSubmit = async (e) => {
        e.preventDefault();

        if (!selectedTypeOption) {
            setSelectedTypeError(true);
            return;
        }
        if (!selectedBrandOption) {
            setSelectedBrandError(true);
            return;
        }
        const formData = new FormData();
        formData.append('MaDH', newWatch.MaDH);
        formData.append('TenDH', newWatch.TenDH);
        formData.append('SoLuongTon', newWatch.SoLuongTon);
        formData.append('MoTa', newWatch.MoTa);
        formData.append('TrangThai', isStatusChecked ? 1 : 0);
        formData.append('is_new', isNewChecked ? 1 : 0);
        formData.append('MaLoai', selectedTypeOption ? selectedTypeOption.MaLoai : '');
        formData.append('MaHang', selectedBrandOption ? selectedBrandOption.MaHang : '');
        formData.append('image', watchImage); // Add the uploaded image to the formData

        try {
            const token = getCookie("tokenAdmin");
            if (!token) {
                navigate("/admin/signin");
                return;
            }
            const response = await API.post('watch/addWatch', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Watch added successfully!',
                }).then(() => {
                    // Đặt lại trạng thái form hoặc thực hiện các tác vụ khác sau khi thông báo được đóng
                    setOpenModal(false);
                    // Hoặc làm gì đó khác
                    fetchWatches();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message,
            });

        }
    };

    const handleEditWatch = (row) => {
        setEditingWatch(row);
        setSelectedBrandOption(brandOptions.find(brand => brand.MaHang === row.MaHang));
        setSelectedTypeOption(typeOptions.find(type => type.MaLoai === row.MaLoai));
        setWatchImage(null);
        setOpenModal(true);
        setSelectedEditTypeError(false);
        setSelectedEditBrandError(false);
    };
    const handleWatchEditSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTypeOption) {
            setSelectedEditTypeError(true);
            return;
        }
        if (!selectedBrandOption) {
            setSelectedEditBrandError(true);
            return;
        }
        const formData = new FormData();
        formData.append('MaDH', editingWatch.MaDH);
        formData.append('TenDH', editingWatch.TenDH);
        formData.append('SoLuongTon', editingWatch.SoLuongTon);
        formData.append('MoTa', editingWatch.MoTaDH);
        formData.append('TrangThai', editingWatch.TrangThai);
        formData.append('is_new', editingWatch.is_new);
        formData.append('MaLoai', selectedTypeOption ? selectedTypeOption.MaLoai : '');
        formData.append('MaHang', selectedBrandOption ? selectedBrandOption.MaHang : '');
        formData.append('image', watchImage); // Add the uploaded image to the formData

        try {
            const token = getCookie("tokenAdmin");
            if (!token) {
                navigate("/admin/signin");
                return;
            }

            const response = await API.put('watch/updateWatch', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Watch updated successfully!',
                }).then(() => {
                    setOpenModal(false);
                    // Refresh the table or perform other actions
                    fetchWatches(); // Call fetchWatches to refresh the table data
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message,
            });
        }
    };

    const handleDeleteWatch = async (row) => {
        try {
            const token = getCookie("tokenAdmin");
            if (!token) {
                navigate("/admin/signin");
                return;
            }

            const response = await API.delete(`/watch/deleteWatch/${row.MaDH}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Watch deleted successfully!',
                }).then(() => {
                    // Refresh the table or perform other actions
                    fetchWatches(); // Call fetchWatches to refresh the table data
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message,
            });
        }
    };

    const handleRowClickWatch = (params) => {
        console.log("Row clicked:", params.row);
    };

    const handleEditPrice= (row) => {
          setSelectedWatchId(row.MaDH);
        setOpenPriceHistoryModal(true);
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
                const watches = response.data.watches;
                const watchessWithId = watches.map((watch) => ({
                    ...watch,
                    id: watch.MaDH,
                }));

                let filteredWatches = watchessWithId;
                if (selectedBrand && selectedBrand.length > 0) {
                    filteredWatches = filteredWatches.filter((watch) => selectedBrand.includes(watch.MaHang));
                }
                if (selectedType && selectedType.length > 0) {
                    filteredWatches = filteredWatches.filter((watch) => selectedType.includes(watch.MaLoai));
                }

                setRows(filteredWatches);
                setFilteredRowsWatch(filteredWatches);

            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            // navigate("/admin/signin");
        }
    };

    useEffect(() => {
        fetchWatches();
    }, [selectedBrand, selectedType]); //

    useEffect(() => {
        const filteredRowswatch = rows.filter((row) =>
            row.TenDH.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRowsWatch(filteredRowswatch);
    }, [searchQuery, rows]);

    const handleCustomRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess();
        }, 0);
    };
    const handleImageChange = (info) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        }
        setWatchImage(info.file.originFileObj);
    };

    return (
        <div>
            <Box display="flex" alignItems="center" justifyContent="space-between" style={{ marginBottom: "20px" }}>
                <TextField
                    label="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "30%" }}
                />
                <Button variant="contained" color="primary" style={{ backgroundColor: 'black' }} onClick={handleAddWatch}>
                    + Add watch
                </Button>

            </Box>
            <div style={{ width: '100%' }} >
                <DataGrid
                    style={{ minHeight: '85vh', maxHeight: '85vh' }}
                    rows={filteredRowswatch}
                    columns={columns}
                    pageSize={5}
                    onRowClick={handleRowClickWatch}
                    rowHeight={200}
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
                        width: 1000,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        outline: "none", // Remove default outline around modal
                    }}
                >
                    {editingWatch ? (
                        <div>
                            <h2>Edit Watch</h2>
                            <form onSubmit={handleWatchEditSubmit}>
                                <Box display="flex">
                                    <Box style={{ width: '30%' }}>
                                        <Upload
                                            style={{ width: '100%', height: '100%' }}
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            customRequest={handleCustomRequest}
                                            onChange={handleImageChange}
                                        >
                                            {editingWatch.HinhAnh || watchImage ? (
                                                <img
                                                    src={
                                                        watchImage
                                                            ? URL.createObjectURL(watchImage)
                                                            : urlImg + editingWatch.HinhAnh
                                                    }
                                                    alt="watch"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div>
                                                    <PlusOutlined />
                                                    <div style={{ marginTop: 8 }}>Upload</div>
                                                </div>
                                            )}
                                        </Upload>

                                    </Box>
                                    <Box style={{ width: '70%', marginLeft: '20px' }}>
                                        <TextField
                                            label="Watch ID"
                                            value={editingWatch.MaDH}
                                            disabled
                                            fullWidth
                                            margin="normal"
                                        />
                                        <Box display="flex">
                                            <TextField
                                                style={{ marginRight: '15px' }}
                                                label="Watch Name"
                                                value={editingWatch.TenDH}
                                                onChange={(e) => setEditingWatch({ ...editingWatch, TenDH: e.target.value })}
                                                fullWidth
                                                margin="normal"
                                            />

                                            <TextField
                                                label="Quantity"
                                                type="number"
                                                value={editingWatch.SoLuongTon}
                                                onChange={(e) => setEditingWatch({ ...editingWatch, SoLuongTon: e.target.value })}
                                                fullWidth
                                                margin="normal"
                                            />
                                        </Box>
                                        <TextField
                                            label="Description"
                                            minRows={3}
                                            multiline
                                            value={editingWatch.MoTaDH}
                                            onChange={(e) => setEditingWatch({ ...editingWatch, MoTaDH: e.target.value })}
                                            fullWidth
                                            margin="normal"
                                        />
                                        <Checkbox
                                            checked={editingWatch.TrangThai === 1}

                                            onChange={(e) => setEditingWatch({ ...editingWatch, TrangThai: e.target.checked ? 1 : 0 })}

                                        />
                                        Trạng thái

                                        <Checkbox
                                            checked={editingWatch.is_new === true}

                                            onChange={(e) => setEditingWatch({ ...editingWatch, is_new: e.target.checked })}

                                        />
                                        is_new
                                        <Box display="flex">
                                            <Autocomplete
                                                style={{ marginRight: '15px', width: '100%' }}
                                                options={typeOptions}
                                                getOptionLabel={(option) => option.TenLoai}
                                                value={selectedTypeOption}
                                                onChange={(event, newValue) => {
                                                    setSelectedTypeOption(newValue);
                                                    setSelectedEditTypeError(false); // Reset the error when a type is selected
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Select Type"
                                                        error={selectedEditTypeError}
                                                        helperText={selectedEditTypeError && "Please select a type."}
                                                    />
                                                )}
                                            />
                                            <Autocomplete
                                                style={{ width: '100%' }}
                                                options={brandOptions}
                                                getOptionLabel={(option) => option.TenHang}
                                                value={selectedBrandOption}
                                                onChange={(event, newValue) => {
                                                    setSelectedBrandOption(newValue);
                                                    setSelectedEditBrandError(false); // Reset the error when a brand is selected
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Select Brand"
                                                        error={selectedEditBrandError}
                                                        helperText={selectedEditBrandError && "Please select a brand."}
                                                    />
                                                )}
                                            />
                                        </Box>
                                    </Box>
                                </Box>

                                <Box display="flex" justifyContent="flex-end" mt={2}>
                                    <Button type="submit" style={{backgroundColor: "black" , color:  "white",}}>Update</Button>
                                </Box>
                            </form>
                        </div>
                    ) : (
                        // Hiển thị form thêm đồng hồ mới
                        <div>
                            <h2>Add Watch</h2>
                            <form onSubmit={handleWatchAddSubmit}>
                                <Box display="flex">
                                    <Box style={{ width: '30%' }}>

                                        <Upload
                                            style={{ width: "30% !important", height: "30%  !important" }}
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            customRequest={handleCustomRequest}
                                            onChange={handleImageChange}
                                        >
                                            {watchImage ? (
                                                <img src={URL.createObjectURL(watchImage)} alt="avatar" style={{ width: '100%' }} />
                                            ) : (
                                                <div>
                                                    <PlusOutlined />
                                                    <div style={{ marginTop: 8 }}>Upload</div>
                                                </div>
                                            )}
                                        </Upload>
                                    </Box>
                                    <Box style={{ width: '70%', marginLeft: '20px' }}>
                                        <TextField
                                            label="Watch ID"
                                            value={newWatch.MaDH}
                                            onChange={(e) => setNewWatch({ ...newWatch, MaDH: e.target.value })}
                                            fullWidth
                                            margin="normal"
                                        />
                                        <Box display="flex">
                                            <TextField
                                                style={{ marginRight: '15px' }}
                                                label="Watch Name"
                                                value={newWatch.TenDH}
                                                onChange={(e) => setNewWatch({ ...newWatch, TenDH: e.target.value })}
                                                fullWidth
                                                margin="normal"
                                            />

                                            <TextField
                                                label="Quantity"
                                                value={newWatch.SoLuongTon}
                                                onChange={(e) => setNewWatch({ ...newWatch, SoLuongTon: e.target.value })}
                                                fullWidth
                                                margin="normal"
                                            />
                                        </Box>
                                        <TextField
                                            label="Description"
                                            minRows={3}
                                            multiline
                                            value={newWatch.MoTa}
                                            onChange={(e) => setNewWatch({ ...newWatch, MoTa: e.target.value })}
                                            fullWidth
                                            margin="normal"
                                        />
                                        <Checkbox
                                            checked={isStatusChecked}
                                            onChange={() => setStatusChecked(!isStatusChecked)}
                                        />
                                        TrangThai
                                        {/* Checkbox for is_new */}
                                        <Checkbox
                                            checked={isNewChecked}
                                            onChange={() => setNewChecked(!isNewChecked)}
                                        />
                                        is_new
                                        <Box display="flex">
                                            <Autocomplete
                                                style={{ marginRight: '15px', width: '100%' }}
                                                options={typeOptions}
                                                getOptionLabel={(option) => option.TenLoai}
                                                value={selectedTypeOption}
                                                onChange={(event, newValue) => {
                                                    setSelectedTypeOption(newValue);
                                                    setSelectedTypeError(false); // Reset the error when a type is selected
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Select Type"
                                                        error={selectedTypeError}
                                                        helperText={selectedTypeError && "Please select a type."}
                                                    />
                                                )}
                                            />
                                            <Autocomplete
                                                style={{ width: '100%' }}
                                                options={brandOptions}
                                                getOptionLabel={(option) => option.TenHang}
                                                value={selectedBrandOption}
                                                onChange={(event, newValue) => {
                                                    setSelectedBrandOption(newValue);
                                                    setSelectedBrandError(false); // Reset the error when a brand is selected
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Select Brand"
                                                        error={selectedBrandError}
                                                        helperText={selectedBrandError && "Please select a brand."}
                                                    />
                                                )}
                                            />
                                        </Box>
                                    </Box>
                                </Box>

                                <Box display="flex" justifyContent="flex-end" mt={2}>
                                    <Button type="submit" style={{backgroundColor: "black" , color:  "white",}}>Save</Button>
                                </Box>
                            </form>
                        </div>
                    )}
                </Box>
            </Modal>

            <PriceHistoryModal
                watchId={selectedWatchId}
                open={openPriceHistoryModal}
                onClose={() => setOpenPriceHistoryModal(false)}
            />

        </div>
    );
};

export default TableWatch;
