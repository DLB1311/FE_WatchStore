import React, { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import SideBar from '../../components/SideBar';
import API from '../../services/api';
import getCookie from '../../utils/getCookie';
import { CardHeader } from '@mui/material';
import Swal from "sweetalert2";


const AdminChangePass = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    const token = getCookie("tokenAdmin");
    if (!token) {
      navigate("/admin/signin");
      return;
    }
    try {
      const response = await API.put(
        "staff/changeStaffPassword",
        {
          currentPassword,
          newPassword,
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
          title: "Password Updated",
          text: response.data.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message,
        });
      }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response.data.message,
          });
    }
  };

  return (
    <SideBar>
    <Box
      display="flex"
      flexDirection="row"
      height="70vh"
      width="80%"
      flex={1}
      justifyContent="center"
     
    >
      <Card
        variant="outlined"
        style={{
          borderRadius: 16,
          width: "50%",
          margin: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardHeader title="Change Password" />
        <CardContent
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={{ margin: "10px" }}
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ margin: "10px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleChangePassword}
            style={{
              backgroundColor: "black" ,
              color:  "white",
              margin: "15px",
            }}
          >
            Change Password
          </Button>
        </CardContent>
      </Card>
    </Box>
  </SideBar>
  );
};

export default AdminChangePass;
