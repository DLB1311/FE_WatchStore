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

import TableStaff from "../../components/TableStaff";


const ManagementStaff = () => {
    const navigate = useNavigate();


    useEffect(() => {
        
    }, []);

    return (

        <SideBar >
            <Box display="flex" flexDirection="row" height="100vh" width="80%" flex={1} >

                <Card variant="outlined" style={{ borderRadius: 7, margin: "5px", width: "100%" }}>
                    {/* <CardHeader title="Watch Management"/> */}
                    <CardContent>
                    <h1 style={{ marginBottom: "30px" }} >Staff Management</h1>
                    <TableStaff/>

                    </CardContent>
                </Card>

            </Box>

        </SideBar>

    );
};

export default ManagementStaff;
