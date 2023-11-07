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
import TextField from "@mui/material/TextField";
import numberToWords from '../utils/numberToWords'
import { getPrintableContent, printInvoice } from '../utils/printInvoice';

const InvoiceModal = ({
    isAddInvoiceModalOpen,
    setIsAddInvoiceModalOpen,
    selectedBookingOrder,
    handleInvoiceCreated,
}) => {
    const navigate = useNavigate();

    const [MaHoaDon, setMaHoaDon] = useState("");
    const [MaSoThue, setMaSoThue] = useState("");
    const [HoTen, setHoTen] = useState("");
    const [invoiceData, setInvoiceData] = useState(null);

    useEffect(() => {
        if (isAddInvoiceModalOpen) {
            setMaHoaDon("");
            setMaSoThue("");
            setHoTen("");
        }
    }, [isAddInvoiceModalOpen]);

    const handleCreateInvoice = async () => {
        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }
        if (!HoTen) {
            Swal.fire({
                icon: "error",
                title: "Invalid data",
                text: "Please enter valid invoice information.",
            });
            return;
        }
        try {
            const response = await API.post(
                `/management/createInvoice/${selectedBookingOrder.MaPD}`,
                {
                    MaHoaDon,
                    MaSoThue,
                    HoTen,
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
                    title: "Invoice Created",
                    text: "The invoice has been created successfully.",
                });


                setInvoiceData(response.data.data);
                setIsAddInvoiceModalOpen(false);

                const printableContent = getPrintableContent(response.data.data);
                printInvoice(printableContent);
                handleInvoiceCreated();
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

    return (
        <div>
            <Modal
                open={isAddInvoiceModalOpen}
                onClose={() => setIsAddInvoiceModalOpen(false)}
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
                    }}
                >
                    <Button
                        onClick={() => setIsAddInvoiceModalOpen(false)}
                        style={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
                    >
                        X
                    </Button>
                    <Typography
                        variant="h4"
                        id="modal-title"
                        component="h2"
                        sx={{ mb: 3 }}
                    >
                        Add Invoice
                    </Typography>

                    <TextField
                        fullWidth
                        label="Invoice Number"
                        value={MaHoaDon}
                        onChange={(e) => setMaHoaDon(e.target.value)}
                        sx={{ mb: 2 }}
                        placeholder="placeholder"
                    />
                    <TextField
                        fullWidth
                        label="Tax Code"
                        value={MaSoThue}
                        onChange={(e) => setMaSoThue(e.target.value)}
                        sx={{ mb: 2 }}
                        placeholder="placeholder"
                    />
                    <TextField
                        fullWidth
                        label="Full Name"
                        value={HoTen}
                        onChange={(e) => setHoTen(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateInvoice}
                            style={{
                                backgroundColor: "black",
                                color: "white",

                            }}
                        >
                            Create Invoice
                        </Button>
                    </Box>


                </Box>
            </Modal>
        </div>
    );
};

export default InvoiceModal;
