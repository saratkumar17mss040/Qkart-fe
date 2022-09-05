import React from 'react';
import { useHistory } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Avatar, Button, Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import './Header.css';

const Header = ({ children, hasHiddenAuthButtons }) => {
	const history = useHistory();

	const register = () => {
		history.push('/register');
	};

	const login = () => {
		history.push('/login');
	};

	const explore = () => {
		history.push('/');
	};

	const logout = () => {
		localStorage.removeItem('username');
		localStorage.removeItem('token');
		localStorage.removeItem('balance');
		window.location.reload();
	};

	if (hasHiddenAuthButtons === true) {
		return (
			<Box className="header">
				<Box className="header-title">
					<img src="logo_light.svg" alt="QKart-icon"></img>
				</Box>
				<Button
					className="explore-button"
					startIcon={<ArrowBackIcon />}
					variant="text"
					onClick={explore}
				>
					Back to explore
				</Button>
			</Box>
		);
	} else if (localStorage.getItem('username')) {
		return (
			<Box className="header">
				<Box className="header-title">
					<img src="logo_light.svg" alt="QKart-icon"></img>
				</Box>
				{children}
				<Stack direction="row" spacing={2}>
					<Avatar alt={localStorage.getItem('username')} src="avatar.png" />
					<Typography variant="h6" gutterBottom>
						{localStorage.getItem('username')}
					</Typography>
					<Button className="explore-button" variant="text" onClick={logout}>
						Logout
					</Button>
				</Stack>
			</Box>
		);
	} else {
		return (
			<Box className="header">
				<Box className="header-title">
					<img src="logo_light.svg" alt="QKart-icon"></img>
				</Box>
				{children}
				<Box className="login-register">
					<Button className="login-button" varient="text" onClick={login}>
						LOGIN
					</Button>
					<Button
						className="register-button"
						variant="contained"
						onClick={register}
					>
						REGISTER
					</Button>
				</Box>
			</Box>
		);
	}
};

export default Header;
