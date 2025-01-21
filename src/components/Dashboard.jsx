import React, { useState, useEffect } from 'react';
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
  Avatar,
  Chip,
  IconButton,
  Divider,
  AppBar,
  Toolbar,
  Tooltip,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchMoreUsers } from '../apis/fetchMoreUsers';
import { fetchInitialUsers } from '../apis/fetchInitialUsers';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#ff4081',
    },
    background: {
      default: '#f5f5f5',
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
        },
      },
    },
  },
});

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [severity, setSeverity] = useState("error");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const USERS_PER_PAGE = 4;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });

  useEffect(() => {
    fetchInitialUsers(
      setUsers,
      setHasMore,
      setError,
      setIsLoading,
      USERS_PER_PAGE,
      setSeverity
    );
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
          setSeverity("error");
          throw new Error("Failed to update user");
        }

        setError("User details edited!");
        setSeverity("success");
        setIsLoading(false);
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

        setError("User Saved");
        setSeverity("success");
        setIsLoading(false);
      }

      if (isEditing) {
        setUsers(
          users.map((user) =>
            user.id === selectedUser.id ? { ...user, ...formData } : user
          )
        );
      } else {
        setUsers([{ ...formData, id: users.length + 1 }, ...users]);
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
        setSeverity("error");
        throw new Error("Failed to delete user");
      }
      setUsers(users.filter((user) => user.id !== userId));
      setIsLoading(false);
      setSeverity("error");
      setError("User deleted");
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

  const getRandomColor = () => {
    const colors = ['#1976d2', '#388e3c', '#d32f2f', '#7b1fa2', '#1976d2', '#c2185b'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
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
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <PersonIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              User Management Dashboard
            </Typography>
            <Tooltip title="Refresh">
              <IconButton 
                color="inherit" 
                onClick={() => fetchInitialUsers(
                  setUsers,
                  setHasMore,
                  setError,
                  setIsLoading,
                  USERS_PER_PAGE,
                  setSeverity
                )}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              mb: 4, 
              display: 'flex', 
              alignItems: 'center',
              borderRadius: 2,
              bgcolor: 'white' 
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 2 }} />
            <TextField
              fullWidth
              variant="standard"
              placeholder="Search users..."
              InputProps={{ disableUnderline: true }}
            />
          </Paper>

          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 2,
              bgcolor: 'white'
            }}
          >
            <Box display="flex" alignItems="center" mb={3}>
              <AddIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h5">
                {isEditing ? 'Edit User' : 'Add New User'}
              </Typography>
            </Box>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
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
                    <Button 
                      variant="outlined" 
                      onClick={resetForm}
                      sx={{ px: 4 }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="contained" 
                      type="submit" 
                      startIcon={isEditing ? <EditIcon /> : <AddIcon />}
                      sx={{ px: 4 }}
                    >
                      {isEditing ? 'Update User' : 'Add User'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>

          {error && (
            <Alert
              severity={severity}
              sx={{ mb: 4, borderRadius: 2 }}
              onClose={() => {
                setError(null);
              }}
            >
              {error}
            </Alert>
          )}

          <InfiniteScroll
            dataLength={users.length}
            next={() => {
              fetchMoreUsers(page, setUsers, setPage, setHasMore, setError, USERS_PER_PAGE);
            }}
            hasMore={hasMore}
            loader={hasMore &&
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress />
              </Box>
            }
            endMessage={
              <Typography textAlign="center" color="textSecondary" py={2}>
                {}
              </Typography>
            }
          >
            <div className="userlist-wrapper">
              <Grid container spacing={3}>
                {users.map((user) => (
                  <Grid item xs={12} md={6} key={user.id}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: 2,
                        bgcolor: 'white',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Avatar 
                            sx={{ 
                              bgcolor: getRandomColor(),
                              width: 50,
                              height: 50,
                              mr: 2
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
                              bgcolor: 'primary.light',
                              color: 'primary.contrastText'
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
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </div>
          </InfiniteScroll>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default UserDashboard;