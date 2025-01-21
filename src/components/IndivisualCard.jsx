import React from "react";
import "../css/UserDashboard.css";
import {
  Typography,
  CardContent,
  Box,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

import { getRandomColor } from "../utils/getRandomColor";
import { getInitials } from "../utils/getInitials";

const IndivisualCard = ({
  user,
  setSelectedUser,
  setFormData,
  setIsEditing,
  handleDelete,
  resetForm
}) => {
  return (
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar
          sx={{
            bgcolor: getRandomColor(),
            width: 50,
            height: 50,
            mr: 2,
          }}
        >
          {getInitials(user.firstName, user.lastName)}
        </Avatar>
        <Box>
          <Typography variant="h6">
            {user.firstName} {user.lastName}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            {user.email}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Chip
          label={user.department}
          size="small"
          sx={{
            bgcolor: "primary.light",
            color: "primary.contrastText",
          }}
        />
        <Box>
          <Tooltip title="Edit User">
            <IconButton
              size="small"
              onClick={() => {
                
                setSelectedUser(user);
                setFormData(user);
                setIsEditing(true);
              }}
              onClickCapture={resetForm}
              sx={{ mr: 1 }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete User">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(user.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </CardContent>
  );
};

export default IndivisualCard;
