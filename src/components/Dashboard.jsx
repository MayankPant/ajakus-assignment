import React, { useState, useEffect } from "react";
import "../css/UserDashboard.css";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { fetchUsers } from "../apis/fetechUsers";

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [severity, setSeverity] = useState('error');

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });

  useEffect(() => {
    fetchUsers(setUsers, setError, setIsLoading, setSeverity);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (isEditing && selectedUser) {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${selectedUser.id}`,
          {
            method: "PUT",
            body: JSON.stringify(formData),
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        if (!response.ok) {
          setIsLoading(false);
          setSeverity('error');
          throw new Error("Failed to update user");
        }
      } else {
        setIsLoading(true);
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users",
          {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        if (!response.ok) {
          setIsLoading(false);
          throw new Error("Failed to add user");
        }
        
        setError('User Saved');
        setSeverity('success');
        setIsLoading(false);
      }

      // Simulate update for JSONPlaceholder
      if (isEditing) {
        setUsers(
          users.map((user) =>
            user.id === selectedUser.id ? { ...user, ...formData } : user
          )
        );
      } else {
        setUsers([...users, { ...formData, id: users.length + 1 }]);
      }

      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (userId) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        setIsLoading(false);
        setSeverity('error');
        throw new Error("Failed to delete user");
      }
      // Simulate deletion for JSONPlaceholder
      setUsers(users.filter((user) => user.id !== userId));
      setIsLoading(false);
      setSeverity('error');
      setError('User deleted');
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      department: "",
    });
    setSelectedUser(null);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          {isEditing ? "Edit User" : "Add New User"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="department"
                label="Department"
                value={formData.department}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="outlined" onClick={resetForm}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  startIcon={isEditing ? <EditIcon /> : <AddIcon />}
                >
                  {isEditing ? "Update User" : "Add User"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {error && (
        <Alert severity={severity} sx={{ mb: 4 }} onClose={() => { setError(null)}}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid item xs={12} key={user.id}>
            <Card>
              <CardContent>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item xs={9}>
                    <Typography variant="h6">
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography color="textSecondary">{user.email}</Typography>
                    <Typography color="textSecondary">
                      {user.department}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => {
                          setSelectedUser(user);
                          setFormData(user);
                          setIsEditing(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UserDashboard;
