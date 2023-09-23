import React, { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import SideBar from '../../components/SideBar';
import API from '../../services/api';
import getCookie from '../../utils/getCookie';
import formatDate from "../../utils/formatDate";
import { CardHeader } from '@mui/material';
import Swal from "sweetalert2";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DatePicker, Space } from 'antd';
import  { getPrintableContent, printRevenue } from '../../utils/printRevenue';

dayjs.extend(customParseFormat);
const dateFormat = 'DD/MM/YYYY';




const AdminHome = () => {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [staff, setStaff] = useState('');

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setFromDate(dates[0]);
      setToDate(dates[1]);
    }
  };

  const fetchRevenueReports = async () => {
    const token = getCookie('tokenAdmin');
    if (!token) {
      navigate('/admin/signin');
      return;
    }
    try {
      const formattedFromDate = fromDate.format(dateFormat);
      const formattedToDate = toDate.format(dateFormat);

      const response = await API.get('management/getRevenueReports', {
        params: {
          fromDate: formattedFromDate,
          toDate: formattedToDate,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Print Revenue",
                    text: "The revenue has been printed successfully.",
                });
                
                const printableContent = getPrintableContent(response.data.revenueReports,formattedFromDate,formattedToDate,staff);
                printRevenue(printableContent);

                // handleInvoiceCreated();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.data.message,
                });
            }
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const fetchStaffInfo = async () => {
    const token = getCookie('tokenAdmin');
    if (!token) {
      navigate('/admin/signin');
      return;
    }
    try {
      const response = await API.get('staff/getInfoStaffByToken',{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setStaff(response.data.data);
      } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.data.message,
                });
            }
    } catch (error) {
      console.error(error);
      window.location.href = "/dlbwatchofficial/admin/signin";
    }
  };

  useEffect(() => {
    fetchStaffInfo();
  }, []);
  return (
    <SideBar>
      <Box display="flex" flexDirection="row" height="100vh" width="80%" flex={1} justifyContent="center" >

        <Card variant="outlined" style={{ borderRadius: 16, width: "90%", margin: "20px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <h1 style={{ marginBottom: "30px" }} >Hello {staff.Ho +" "+ staff.Ten}</h1>
          <CardHeader title="Daily revenue report" />
          <CardContent style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div>
              <p>Date range</p>

              <Space direction="vertical" size={12}>
                <DatePicker.RangePicker
                  defaultValue={[fromDate,toDate]}
                  format={dateFormat}
                  onChange={handleDateChange}
                />
              </Space>
              
            </div>

            <Button 
            style={{
              backgroundColor: "black" ,
              color:  "white",
              margin: "15px",
            }}
            onClick={fetchRevenueReports}>Print Report</Button>
          </CardContent>
        </Card>

      </Box>
    </SideBar>
  );
};

export default AdminHome;
