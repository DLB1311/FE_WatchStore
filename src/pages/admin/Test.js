import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import SideBar from "../../components/SideBar";

const DataTable = () => {
  // Sample data for the table
  const rows = [
    { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', age: 28, email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', age: 35, email: 'bob@example.com' },
    // Add more data as needed
  ];

  // Define columns for the table
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'age', headerName: 'Age', width: 100 },
    { field: 'email', headerName: 'Email', width: 300 },
  ];

  // State to hold the search query
  const [searchQuery, setSearchQuery] = useState('');

  // Filter the rows based on the search query
  const filteredRows = rows.filter(
    (row) =>
      row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.age.toString().includes(searchQuery)
  );

  return (
      <SideBar>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Card variant="outlined" style={{ borderRadius: 16 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <TextField
              label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginBottom: 20 }}
            />
            <Button variant="contained" color="primary" style={{backgroundColor: 'black'}} onClick={() => console.log('Add button clicked')}>
              Add
            </Button>
          </Box>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={filteredRows} columns={columns} pageSize={5} />
          </div>
        </CardContent>
        
      </Card>
    </Box>
      
    </SideBar>
    
  );
};

export default DataTable;
