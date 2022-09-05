import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { Link, useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const registrationData = {
    username: "",
    password: "",
    confirmPassword: "",
  };
  const [formData, setform] = useState(registrationData);
  const [isLoading, setIsLoding] = useState(false);
  const [success, setSuccess] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (success) {
      history.push("/login");
    }
  }, [success, history]);

  const register = async (formData) => {
    setIsLoding(true);
    if (validateInput(formData)) {
      await axios
        .post(`${config.endpoint}/auth/register`, {
          username: formData.username,
          password: formData.password,
        })
        .then((res) => {
          if (res.data.success) {
            enqueueSnackbar("User registration successful", {
              variant: "success",
            });
          }
        })
        .catch((err) => {
          setIsLoding(false);
          if (!err.response.data.success && err.response.status === 400) {
            enqueueSnackbar(err.response.data.message, { variant: "error" });
          } else {
            enqueueSnackbar(
              "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
              { variant: "error" }
            );
          }
        });
    }
    setIsLoding(false);
    setSuccess(true);
  };

  const validateInput = (data) => {
    const { username, password, confirmPassword } = data;
    if (!username) {
      enqueueSnackbar("Username is a required field", { variant: "error" });
      return false;
    } else if (username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", {
        variant: "error",
      });
      return false;
    } else if (!password) {
      enqueueSnackbar("Password is a required field", { variant: "error" });
      return false;
    } else if (password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "error",
      });
      return false;
    } else if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return false;
    }
    return true;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setform({ ...formData, [name]: value });
  };

  const handleClick = () => {
    register(formData);
  };

  const DisplayLoaderOrRegisterBtnUI = ({ isLoading }) => {
    if (isLoading) {
      return (
        <div className="loading">
          <CircularProgress />
        </div>
      );
    }
    return (
      <Button onClick={handleClick} className="button" variant="contained">
        Register Now
      </Button>
    );
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={true} />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            onChange={handleChange}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={handleChange}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            onChange={handleChange}
          />
          <DisplayLoaderOrRegisterBtnUI isLoading={isLoading} />
          <p className="secondary-action">
            Already have an account?
            <Link className="link" to="/login">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
