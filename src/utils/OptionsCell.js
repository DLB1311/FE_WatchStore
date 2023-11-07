// OptionsCell.js
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TuneIcon from '@mui/icons-material/Tune';

const OptionsCell = ({ onEdit, onDelete , onCustom,onCusDiscount,onWholeSaleOrder,onWholeSaleOrderDetail }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit();
    handleClose();
  };

  const handleDelete = () => {
    onDelete();
    handleClose();
  };

  const handleCustom = () => {
    onCustom();
    handleClose();
  };

  const handleCusDiscount= () => {
    onCusDiscount();
    handleClose();
  };

  const handleWholeSaleOrder= () => {
    onWholeSaleOrder();
    handleClose();
  }; 

  const handleWholeSaleOrderDetail= () => {
    onWholeSaleOrderDetail();
    handleClose();
  }; 

  return (
    <div>
      <IconButton
        aria-controls="options-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="options-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >

{onEdit  && (
        <MenuItem onClick={handleEdit}>
          <EditIcon style={{ marginRight: '8px' }} />
          Edit
        </MenuItem>
        )}

        {onDelete  && (
        <MenuItem onClick={handleDelete}>
          <DeleteIcon style={{ marginRight: '8px' }} />
          Delete
        </MenuItem>
        )}

        {onCustom  && (
          <MenuItem onClick={handleCustom}>
            <TuneIcon style={{ marginRight: '8px' }} />
            Edit Price
          </MenuItem>
        )}
        {onCusDiscount  && (
          <MenuItem onClick={handleCusDiscount}>
            <TuneIcon style={{ marginRight: '8px' }} />
            Edit Detail
          </MenuItem>
        )}
        {onWholeSaleOrder && (
          <MenuItem onClick={handleWholeSaleOrder}>
            <TuneIcon style={{ marginRight: '8px' }} />
            Supplier Purchase Order
          </MenuItem>
        )}

        {onWholeSaleOrderDetail && (
          <MenuItem onClick={handleWholeSaleOrderDetail}>
            <TuneIcon style={{ marginRight: '8px' }} />
            Detail
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default OptionsCell;
