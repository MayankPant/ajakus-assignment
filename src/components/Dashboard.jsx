import React, { useState, useEffect } from "react";
import "../css/UserDashboard.css";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  Alert,
  Box,
  CircularProgress,
  IconButton,
  AppBar,
  Toolbar,
  Tooltip,
} from "@mui/material";
import {
  Person as PersonIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreUsers } from "../apis/fetchMoreUsers";
import { fetchInitialUsers } from "../apis/fetchInitialUsers";
import SearchBar from "./SearchBar";
import SubmitForm from "./SubmitForm";
import IndivisualCard from "./IndivisualCard";
import { search } from "../utils/search";
import "../css/UserDashboard.css";

const USERS_PER_PAGE = 4;
const BACKEND_SERVER_BASE_ADDRESS = process.env.REACT_APP_BACKEND_BASEADDRESS;
console.log(BACKEND_SERVER_BASE_ADDRESS);
const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [severity, setSeverity] = useState("error");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [reload, setReload] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    department: "",
    company: {
      name: "",
    },
  });

  const handleSelectedUser = (user) => {
    const firstName = user.name.split(" ")[0];
    const lastName = user.name.split(" ")[1];
    const department = user.company.name;
    user.firstName = firstName;
    user.lastName = lastName;
    user.department = department;
    const formData = {
      firstName: firstName,
      lastName: lastName,
      email: user.email,
      department: department,
      company: {
        name: department,
      },
    };
    setFormData(formData);
    setSelectedUser(user);
  };

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
        formData.name = formData.firstName + " " + formData.lastName;
        formData.company.name = formData.department;
        const response = await fetch(
          BACKEND_SERVER_BASE_ADDRESS.concat(`users/${selectedUser.id}`),
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
        formData.name = formData.firstName + " " + formData.lastName;
        formData.company.name = formData.department;
        setIsLoading(true);
        const response = await fetch(
          BACKEND_SERVER_BASE_ADDRESS.concat("users"),
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
        BACKEND_SERVER_BASE_ADDRESS.concat(`users/${userId}`),
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

  const handleReload = () => {
    setPage(1);
    setHasMore(true);
    setUsers([]); // Reset the users array before fetching initial users
    fetchInitialUsers(
      setUsers,
      setHasMore,
      setError,
      setIsLoading,
      USERS_PER_PAGE,
      setSeverity
    );
  };

  const resetForm = () => {
    console.log("Data data reset");
    setFormData({
      firstName: "",
      lastName: "",
      name: "",
      email: "",
      department: "",
      company: {
        name: "",
      },
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
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <PersonIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            User Management Dashboard
          </Typography>
          <Tooltip title="Refresh">
            <IconButton
              color="inherit"
              onClick={() =>
                fetchInitialUsers(
                  setUsers,
                  setHasMore,
                  setError,
                  setIsLoading,
                  USERS_PER_PAGE,
                  setSeverity
                )
              }
            >
              <Tooltip title="Refresh">
                <IconButton color="inherit" onClick={handleReload}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
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
            display: "flex",
            alignItems: "center",
            borderRadius: 2,
            bgcolor: "white",
          }}
        >
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </Paper>

        <SubmitForm
          isEditing={isEditing}
          handleSubmit={handleSubmit}
          formData={formData}
          handleInputChange={handleInputChange}
          resetForm={resetForm}
        />

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
          key={reload}
          next={() => {
            fetchMoreUsers(
              page,
              setUsers,
              setPage,
              setHasMore,
              setError,
              USERS_PER_PAGE
            );
          }}
          hasMore={hasMore}
          loader={
            hasMore && (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress />
              </Box>
            )
          }
          endMessage={
            <Typography textAlign="center" color="textSecondary" py={2}>
              {}
            </Typography>
          }
        >
          <div className="userlist-wrapper">
            <Grid container spacing={3}>
              {console.log(
                "Recieved search results",
                search(searchTerm, users)
              )}
              {search(searchTerm, users).map((user) => (
                <Grid item xs={12} md={6} key={user.id}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      bgcolor: "white",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <IndivisualCard
                      user={user}
                      handleSelectedUser={handleSelectedUser}
                      setFormData={setFormData}
                      setIsEditing={setIsEditing}
                      handleDelete={handleDelete}
                      resetForm={resetForm}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </InfiniteScroll>
      </Container>
    </Box>
  );
};

export default UserDashboard;
