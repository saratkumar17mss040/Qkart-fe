import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import { Button, CircularProgress, Stack, TextField, Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import { config } from '../App';
import Footer from './Footer';
import Header from './Header';
import './Login.css';

const Login = () => {
	const { enqueueSnackbar } = useSnackbar();
	const loginData = {
		username: '',
		password: '',
	};
	const [formData, setform] = useState(loginData);
	const [isLoading, setIsLoding] = useState(false);
	const [success, setSuccess] = useState(false);
	const history = useHistory();

	useEffect(() => {
		if (success) {
			history.push('/');
		}
	}, [success, history]);

	const login = async (formData) => {
		setIsLoding(true);
		if (validateInput(formData)) {
			await axios
				.post(`${config.endpoint}/auth/login`, {
					username: formData.username,
					password: formData.password,
				})
				.then((res) => {
					const { success, token, balance, username } = res.data;
					if (success) {
						enqueueSnackbar('Logged in', {
							variant: 'success',
						});
						persistLogin(token, username, balance);
					}
				})
				.catch((err) => {
					if (!err.response.data.success && err.response.status === 400) {
						enqueueSnackbar(err.response.data.message, { variant: 'error' });
					} else {
						enqueueSnackbar(
							'Something went wrong. Check that the backend is running, reachable and returns valid JSON.',
							{ variant: 'error' }
						);
					}
				});
		}
		setIsLoding(false);
		setSuccess(true);
	};

	const validateInput = (data) => {
		const { username, password } = data;
		if (!username) {
			enqueueSnackbar('Username is a required field', { variant: 'error' });
			return false;
		} else if (!password) {
			enqueueSnackbar('Password is a required field', { variant: 'error' });
			return false;
		}
		return true;
	};

	const persistLogin = (token, username, balance) => {
		localStorage.setItem('token', token);
		localStorage.setItem('username', username);
		localStorage.setItem('balance', balance);
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setform({ ...formData, [name]: value });
	};

	const DisplayLoaderOrLoginBtnUI = ({ isLoading }) => {
		if (isLoading) {
			return (
				<div className="loading">
					<CircularProgress />
				</div>
			);
		}
		return (
			<Button
				onClick={() => {
					login(formData);
				}}
				className="button"
				variant="contained"
			>
				LOGIN TO QKART
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
					<h2 className="title">Login</h2>
					<TextField
						id="username"
						label="Username"
						variant="outlined"
						title="Username"
						name="username"
						onChange={handleChange}
						fullWidth
					/>
					<TextField
						id="password"
						variant="outlined"
						label="Password"
						name="password"
						type="password"
						fullWidth
						onChange={handleChange}
					/>
					<DisplayLoaderOrLoginBtnUI isLoading={isLoading} />
					<p className="secondary-action">
						Don’t have an account?
						<Link className="link" to="/register">
							Register now
						</Link>
					</p>
				</Stack>
			</Box>
			<Footer />
		</Box>
	);
};

export default Login;
