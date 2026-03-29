import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { 
    Container,
    Box,
    Card,
    CardContent,
    TextField, 
    IconButton,
    Button, 
    Typography,
    InputAdornment, 
    CircularProgress } from "@mui/material";

import { MdVisibility, MdVisibilityOff, MdAccountBalance } from 'react-icons/md';
import { FaUser, FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { login, clearError } from '../../redux/slices/authSlice';
import { use } from "react";

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({          ///to store username and password on login page
        username: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false); /////To toggle password visibility bye eye icon

    useEffect(() => {                   //if already authenticated, redirect to dashboard
        if (isAuthenticated) {
            navigate("/dashboard");
            toast.success("Welcome back!");
        }
}, [isAuthenticated, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError()); 
        }
    }, [error, dispatch]);

    ////Login form input
    const handleChange = (e) => {
        setFormData({
            ...formData,                    //spread it, so that it doesn't reset at every click
            [e.target.name]: e.target.value, //used for both username and password 
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();        ///to prevent page reload on form submit
        if(!formData.username || !formData.password){
            toast.error("Please fill in all fields");
            return;
        }
        dispatch(login(formData));
    }

      return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <Container maxWidth="sm">
        <Card className="shadow-hover">
          <CardContent className="p-8">
            {/* Logo & Header */}
            <Box className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 md:p-2 rounded-full">
                  <MdAccountBalance className="text-white text-5xl" />
                </div>
              </div>
              <Typography variant="h4" className="font-heading font-bold text-gray-800 mb-2 md:mb-5">
                Welcome Back!
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Sign in to continue to your account
              </Typography>
            </Box>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUser className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock className="text-gray-400" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 py-3 mt-6"
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/*Register link*/}
            <Box className="text-center mt-6">
              <Typography variant="body2" color="textSecondary">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Create Account
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Typography variant="body2" className="text-center mt-4 text-white">
          © 2026 Banking App. All rights reserved to Yash.
        </Typography>
      </Container>
    </div>
  );
};

export default LoginForm;