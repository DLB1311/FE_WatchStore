import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Swal from 'sweetalert2';
import API from '../../services/api';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import urlImg from "../../services/urlImg";
import { useNavigate } from "react-router-dom";
import getCookie from '../../utils/getCookie';
import '../../css/adminsignin.css';
import formatDateTime from "../../utils/formatDateTime";
import getOrderStatusText from "../../utils/orderUtils";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import BookingOrderModal from '../../components/BookingOrderModal';
import LogoutIcon from '@mui/icons-material/Logout';


const Header = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px',
  backgroundColor: 'black',
  color: 'white',
});

const Logo = styled('img')({
  width: '50px',
  height: 'auto',
});

const StatusBadge = styled('span')(({ theme, status }) => ({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '4px',
    backgroundColor: status === 3 ? theme.palette.success.main : theme.palette.warning.main,
    color: theme.palette.common.white,
}));

const CompleteButton = styled(Button)({
  padding: '10px',
  alignItems: 'center',
  backgroundColor: 'green', // Set the default background color
  color: 'white',
  '&.disabled': {
      backgroundColor: 'grey', // Change the background color when button is disabled
      cursor: 'not-allowed',
  },
});

const ShipperComplete = () => {
    const navigate = useNavigate();
    const [bookingOrders, setBookingOrders] = useState([]);

    const fetchOderShip = async () => {
        const token = getCookie("tokenAdmin");
        if (!token) {
            navigate("/admin/signin");
            return;
        }
        try {
            const response = await API.get('/management/getDeliveryStaffBookingOrders', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setBookingOrders(response.data.bookingOrders);
                
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCompleteOrder = async (maPD) => {
      try {
        const token = getCookie("tokenAdmin");
        if (!token) {
          navigate("/admin/signin");
          return;
        }
    
        // Show a confirmation dialog before completing the order
        const confirmation = await Swal.fire({
          title: "Confirm Completion",
          text: "Are you sure you want to complete this order?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, complete it!",
        });
    
        if (confirmation.isConfirmed) {
          const response = await API.post(`/management/completeOrder/${maPD}`, {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          if (response.data.success) {
            // Order completed successfully, update the UI or refetch orders
            Swal.fire("Success", "Order completed successfully", "success");
            fetchOderShip();
          } else {
            console.log(response.data.message);
          }
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "An error occurred while completing the order", "error");
      }
    };
    
    useEffect(() => {
        fetchOderShip();
    }, []);

    const removeCookie = (name) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };
  const handleLogout = () => {
      // Xóa token trong cookie
      removeCookie('tokenAdmin');
  
      // Tải lại trang
      window.location.reload();
  };
    return (
        <div>
          <Header>
        <Logo src={urlImg+"/dlb-logo.png"} alt="Logo" />
        <Button onClick={handleLogout} style={{color:'white'}}><LogoutIcon/></Button>
      </Header>
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {bookingOrders.map((order) => (
                
                    <Card sx={{ width: '50vh', margin:"10px"}}>
                        <CardContent>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' , marginBottom:'25px'}}>Order #{order.MaPD}</h2>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom:'25px' }}>
                                <p style={{ fontSize: '1.2rem' }}>Date: {formatDateTime(order.NgayDat)}</p>
                                <StatusBadge status={order.TrangThai}>{getOrderStatusText(order.TrangThai)}</StatusBadge>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', textAlign: 'left' }}>
                                <div>
                                    <strong style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '5px 0' }}>Customer:</strong>
                                    <p style={{ fontSize: '1.2rem', margin: '5px 0' }}> {order.HoNN} {order.TenNN}</p>
                                </div>

                                <div>
                                <strong style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '5px 0' }}>Delivery Address: </strong>
                                <p style={{ fontSize: '1.2rem', margin: '5px 0' }}>{order.DiaChiNN}</p>
                                </div>
                                <div>
                                <strong style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '5px 0' }}>Contact: </strong>
                                <p style={{ fontSize: '1.2rem', margin: '5px 0' }}> {order.SDT}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent:'center' }}>
                            {order.TrangThai === 2 && ( 
                            <CompleteButton
                                key={order.MaPD}
                                onClick={() => handleCompleteOrder(order.MaPD)}
                                disabled={order.TrangThai !== 2} // Disable button if status is not 2
                                className={order.TrangThai !== 2 ? 'disabled' : ''} // Apply disabled style
                            >
                                Complete
                            </CompleteButton>
                               )}
                            </div>
                        </CardContent>
                    </Card>
                
            ))}



        </Box>
    </div>
    );
};

export default ShipperComplete;
