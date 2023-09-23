import React, { useState, useEffect } from "react";
import Modal from '@mui/material/Modal';
import { DataGrid } from '@mui/x-data-grid';
import API from '../services/api';
import { useNavigate } from "react-router-dom";
import getCookie from '../utils/getCookie';
import formatDateTime from "../utils/formatDateTime";
import { Autocomplete, TextField } from "@mui/material";
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DatePicker, Space } from 'antd';
import "../css/adminform.css"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Swal from 'sweetalert2';

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
};


const PriceHistoryModal = ({ watchId, open, onClose }) => {
    const navigate = useNavigate();
    const [priceHistory, setPriceHistory] = useState([]);
    const [newPrice, setNewPrice] = useState("");
    const [newDate, setNewDate] = useState("");
    const [addingPrice, setAddingPrice] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    
    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(() => {
        if (open) {
            fetchPriceHistory();
        }
    }, [open]);

    const fetchPriceHistory = async () => {
        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }
        try {
            const response = await API.get(`watch/getWatchPriceHistory/${watchId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                const priceHistoryWithIds = response.data.priceHistory.map((item, index) => ({
                    ...item,
                    id: index,
                }));
                setPriceHistory(priceHistoryWithIds);
            } else {
                // Handle error or show a message
            }
        } catch (error) {
            console.error(error);
            // Handle error or show a message
        }
    };
    const handleAddPrice = async () => {
        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }
        try {
            // Validate the newPrice before proceeding
            if (!newPrice || isNaN(parseFloat(newPrice)) || !newDate) {
                // Handle invalid price input
                return;
            }

            setAddingPrice(true);
            const response = await API.post(
                `watch/addPriceChange`,
                {
                    MaDH: watchId,
                    TGThayDoi: newDate.format("YYYY-MM-DD HH:mm:ss"),
                    Gia: parseFloat(newPrice), // Convert newPrice to a number
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data.success) {
                // Price change added successfully, refresh the price history
                fetchPriceHistory();
            } else {
                // Handle error or show a message
            }
        } catch (error) {
            console.error(error);
            // Handle error or show a message
        } finally {
            setNewPrice("");
            setNewDate("");
            setAddingPrice(false); // Reset the addingPrice state
        }
    };

    const handleEditButtonClick = (rowData) => {
        setSelectedRow(rowData);
        setShowAddForm(false); // Hide the add form
        setShowEditForm(true);
    };
    const handleEditPrice = async (rowData) => {
        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }
        try {
            const response = await API.put(
                `watch/editPriceChange`,
                {
                    MaDH: rowData.MaDH,
                    TGThayDoi: rowData.TGThayDoi,
                    Gia: parseFloat(rowData.Gia),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data.success) {
                // Price change updated successfully, refresh the price history
                fetchPriceHistory();
            } else {
                // Handle error or show a message
            }
        } catch (error) {
            console.error(error);
            // Handle error or show a message
        }
    };

    const handleDeletePrice = async (rowData) => {
        const shouldDelete = await Swal.fire({
            title: 'Delete Price Change',
            text: 'Are you sure you want to delete this price change?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
        });

        if (!shouldDelete.isConfirmed) {
            return;
        }

        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }

        try {
            const response = await API.delete(`watch/deletePriceChange`, {
                data: {
                    MaDH: rowData.MaDH,
                    MaNV: rowData.MaNV,
                    TGThayDoi: rowData.TGThayDoi,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                // Price change deleted successfully, refresh the price history
                fetchPriceHistory();
            } else {
                // Handle error or show a message
            }
        } catch (error) {
            console.error(error);
            // Handle error or show a message
        }
    };
    const columns = [
        { field: 'MaDH', headerName: 'Watch Id', flex: 1 },
        { field: 'MaNV', headerName: 'Staff Id', flex: 1 },
        {
            field: 'TGThayDoi',
            headerName: 'Date',
            flex: 1,
            renderCell: (params) => (
              <span>{dayjs(params.value).format('YYYY-MM-DD HH:mm:ss')}</span>
            ),
          },
          {
            field: 'Gia',
            headerName: 'Price',
            flex: 1,
            renderCell: (params) => (
              <span>{parseFloat(params.value).toLocaleString()}</span>
            ),
          },
          {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <>
                <EditIcon
                        color="secondary"
                        onClick={() => handleEditButtonClick(params.row)}
                    />
                    <DeleteIcon
                        color="secondary"
                        onClick={() => handleDeletePrice(params.row)}
                    />
                    
                </>
            ),
        },
    ];
    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
    };
    const disabledDateTime = () => ({
        disabledHours: () => range(0, 24).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
    });

    return (
        <Modal
            open={open}
            onClose={() => {
                onClose(); // Close the modal
                setSelectedRow(null); // Reset selectedRow when modal is closed
            }}
            aria-labelledby="price-history-modal-title"
            aria-describedby="price-history-modal-description"
            style={{ zIndex: 4 }}
        >
            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                backgroundColor: "#ffffff",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                padding: "20px",
                borderRadius: "5px",
            }}>
                <h2 id="price-history-modal-title" style={{ marginBottom: "20px" }}>Price History</h2>


                {showAddForm ? (
                    <div style={{ marginTop: "20px", textAlign: "center" }}>
                        <TextField
                            label="New Price"
                            variant="outlined"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            disabled={addingPrice}
                            style={{ margin: "10px" }}
                        />
                        <div className="date-picker-container" style={{ margin: "10px" }}>
                            <DatePicker
                                format="YYYY-MM-DD HH:mm:ss"
                                disabledDate={disabledDate}
                                disabledTime={disabledDateTime}
                                showTime={{
                                    defaultValue: dayjs('00:00:00', 'HH:mm:ss'),
                                }}
                                value={newDate}
                                onChange={setNewDate}
                            />
                        </div>
                        <Button
                            variant="contained"
                            onClick={handleAddPrice}
                            disabled={addingPrice}
                            style={{ backgroundColor: "black", color: "white", margin: "10px" }}
                        >
                            Save
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setShowAddForm(false);
                                setNewPrice("");
                            }}
                            disabled={addingPrice}
                            style={{ backgroundColor: "white", color: "black", border: "1px solid black", margin: "10px" }}
                        >
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <div style={{ marginTop: "20px" }}>
                        <Button variant="contained" onClick={() => setShowAddForm(true)} style={{ backgroundColor: "black", color: "white", marginBottom: "10px" }}>
                            + Add
                        </Button>
                    </div>
                )}

                {selectedRow && (
                    <div style={{ marginTop: "20px", textAlign: "center" }}>
                        {/* Display selected row's data */}
                        <TextField
                            label="Watch Id"
                            variant="outlined"
                            value={selectedRow.MaDH}
                            disabled
                            style={{ margin: "10px" }}
                        />
                        <TextField
                            label="Staff Id"
                            variant="outlined"
                            value={selectedRow.MaNV}
                            disabled
                            style={{ margin: "10px" }}
                        />
                        <TextField
                            label="Date"
                            variant="outlined"
                            value={selectedRow.TGThayDoi}
                            disabled
                            style={{ margin: "10px" }}
                        />
                        <TextField
                            label="Price"
                            variant="outlined"
                            value={selectedRow.Gia}
                            onChange={(e) =>
                                setSelectedRow({ ...selectedRow, Gia: e.target.value })
                            }
                            style={{ margin: "10px" }}
                        />

                        {/* Save and Cancel buttons */}
                        <Button
                            variant="contained"
                            onClick={() => handleEditPrice(selectedRow)}
                            style={{ backgroundColor: "black", color: "white", margin: "10px" }}
                        >
                            Save
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => setSelectedRow(null)} // Clear selected row data
                            style={{ backgroundColor: "white", color: "black", border: "1px solid black", margin: "10px" }}
                        >
                            Cancel
                        </Button>
                    </div>
                )}
                <div style={{ height: 300, width: "100%" }}>
                    <DataGrid rows={priceHistory} columns={columns} pageSize={5} />
                </div>


            </div>
        </Modal>
    );
};

export default PriceHistoryModal;
