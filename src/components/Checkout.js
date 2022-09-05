import { CreditCard, Delete } from '@mui/icons-material';
import {
	Button,
	Divider,
	Grid,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { config } from '../App';
import Cart, { getTotalCartValue, generateCartItemsFrom } from './Cart';
import './Checkout.css';
import Footer from './Footer';
import Header from './Header';

const AddNewAddressView = ({
	token,
	newAddress,
	handleNewAddress,
	addAddress,
}) => {
	return (
		<Box display="flex" flexDirection="column">
			<TextField
				multiline
				minRows={4}
				placeholder="Enter your complete address"
				onChange={(e) => {
					handleNewAddress({
						...newAddress,
						isAddingNewAddress: true,
						value: e.target.value,
					});
				}}
			/>
			<Stack direction="row" my="1rem">
				<Button
					variant="contained"
					onClick={() => {
						addAddress(token, newAddress);
					}}
				>
					Add
				</Button>
				<Button
					variant="text"
					onClick={() => {
						handleNewAddress({ ...newAddress, isAddingNewAddress: false });
					}}
				>
					Cancel
				</Button>
			</Stack>
		</Box>
	);
};

const Checkout = () => {
	const token = localStorage.getItem('token');
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();
	const [items, setItems] = useState([]);
	const [products, setProducts] = useState([]);
	const [addresses, setAddresses] = useState({ all: [], selected: '' });
	const [newAddress, setNewAddress] = useState({
		isAddingNewAddress: false,
		value: '',
	});

	// Fetch the entire products list
	const getProducts = async () => {
		try {
			const response = await axios.get(`${config.endpoint}/products`);
			setProducts(response.data);
			return response.data;
		} catch (e) {
			if (e.response && e.response.status === 500) {
				enqueueSnackbar(e.response.data.message, { variant: 'error' });
				return null;
			} else {
				enqueueSnackbar(
					'Could not fetch products. Check that the backend is running, reachable and returns valid JSON.',
					{
						variant: 'error',
					}
				);
			}
		}
	};

	// Fetch cart data
	const fetchCart = async (token) => {
		if (!token) return;
		try {
			const response = await axios.get(`${config.endpoint}/cart`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			return response.data;
		} catch {
			enqueueSnackbar(
				'Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.',
				{
					variant: 'error',
				}
			);
			return null;
		}
	};

	const getAddresses = async (token) => {
		if (!token) return;

		try {
			const response = await axios.get(`${config.endpoint}/user/addresses`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setAddresses({ ...addresses, all: response.data });
			return response.data;
		} catch {
			enqueueSnackbar(
				'Could not fetch addresses. Check that the backend is running, reachable and returns valid JSON.',
				{
					variant: 'error',
				}
			);
			return null;
		}
	};

	const addAddress = async (token, newAddress) => {
		try {
			if (!token) return;
			const res = await axios.post(
				`${config.endpoint}/user/addresses`,
				{
					address: newAddress.value,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setNewAddress({ ...newAddress, isAddingNewAddress: false });
			setAddresses({ ...addresses, all: res.data });
			return res.data;
		} catch (e) {
			if (e.response) {
				enqueueSnackbar(e.response.data.message, { variant: 'error' });
			} else {
				enqueueSnackbar(
					'Could not add this address. Check that the backend is running, reachable and returns valid JSON.',
					{
						variant: 'error',
					}
				);
			}
		}
	};

	const deleteAddress = async (token, addressId) => {
		try {
			const url = `${config.endpoint}/user/addresses/${addressId}`;
			const response = await axios.delete(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setAddresses({ ...addresses, all: response.data });
			return response.data;
		} catch (e) {
			if (e.response) {
				enqueueSnackbar(e.response.data.message, { variant: 'error' });
			} else {
				enqueueSnackbar(
					'Could not delete this address. Check that the backend is running, reachable and returns valid JSON.',
					{
						variant: 'error',
					}
				);
			}
		}
	};

	const validateRequest = (items, addresses) => {
		if (localStorage.getItem('balance') < getTotalCartValue(items)) {
			enqueueSnackbar(
				'You do not have enough balance in your wallet for this purchase',
				{ variant: 'error' }
			);
			return false;
		} else if (addresses.length === 0) {
			enqueueSnackbar('Please add a new address before proceeding.', {
				variant: 'error',
			});
			return false;
		} else if (addresses.selected === '') {
			console.log('address not selected');
			enqueueSnackbar('Please select one shipping address to proceed.', {
				variant: 'error',
			});
			return false;
		}
		return true;
	};

	const performCheckout = async (token, items, addresses) => {
		if (validateRequest(items, addresses)) {
			try {
				const response = await axios.post(
					`${config.endpoint}/cart/checkout`,
					{ addressId: addresses.selected },
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				localStorage.setItem(
					'balance',
					localStorage.getItem('balance') - getTotalCartValue(items)
				);
				enqueueSnackbar('Order placed successfully', {
					variant: 'success',
				});
				history.push('/thanks');
			} catch (error) {
				if (error.response) {
					enqueueSnackbar(error.response.data.message, {
						variant: 'error',
					});
				} else {
					enqueueSnackbar(
						'Could not delete this address. Check that the backend is running, reachable and returns valid JSON.',
						{
							variant: 'error',
						}
					);
				}
			}
		}
	};

	// Fetch products and cart data on page load
	useEffect(() => {
		const onLoadHandler = async () => {
			if (localStorage.getItem('token')) {
				getAddresses(localStorage.getItem('token'));
				const productsData = await getProducts();
				const cartData = await fetchCart(token);

				if (productsData && cartData) {
					const cartDetails = await generateCartItemsFrom(
						cartData,
						productsData
					);
					setItems(cartDetails);
				}
			} else {
				enqueueSnackbar('You must be logged in to access checkout page', {
					variant: 'info',
				});
				history.push('/');
			}
		};
		onLoadHandler();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Header />
			<Grid container bgcolor="#E9F5E1">
				<Grid item xs={12} md={9} bgcolor="#FFF" sx={{ marginTop: '0.5rem' }}>
					<Box className="shipping-container" minHeight="100vh">
						<Typography color="#3C3C3C" variant="h4" my="1rem">
							Shipping
						</Typography>
						<Typography color="#3C3C3C" my="1rem">
							Manage all the shipping addresses you want. This way you won't
							have to enter the shipping address manually with every order.
							Select the address you want to get your order delivered.
						</Typography>
						<Divider />
						<Box>
							{addresses.all.length === 0 ? (
								<Typography my="1rem">
									No addresses found for this account. Please add one to proceed
								</Typography>
							) : (
								addresses.all.map((data) => (
									<Box
										className={
											addresses.selected === data._id
												? 'address-item selected'
												: 'address-item not-selected'
										}
										key={data._id}
										onClick={(e) => {
											setAddresses((currAddress) => ({
												...currAddress,
												selected: data._id,
											}));
										}}
									>
										<Typography variant="p">{data.address}</Typography>
										<Button
											variant="text"
											startIcon={<Delete />}
											onClick={(event) => {
												deleteAddress(token, data._id);
											}}
										>
											DELETE
										</Button>
									</Box>
								))
							)}
						</Box>
						{!newAddress.isAddingNewAddress ? (
							<Button
								color="primary"
								variant="contained"
								id="add-new-btn"
								size="large"
								onClick={() => {
									setNewAddress((currNewAddress) => ({
										...currNewAddress,
										isAddingNewAddress: true,
									}));
								}}
							>
								Add new address
							</Button>
						) : (
							<AddNewAddressView
								token={token}
								newAddress={newAddress}
								handleNewAddress={setNewAddress}
								addAddress={addAddress}
							/>
						)}

						<Typography color="#3C3C3C" variant="h4" my="1rem">
							Payment
						</Typography>
						<Typography color="#3C3C3C" my="1rem">
							Payment Method
						</Typography>
						<Divider />

						<Box my="1rem">
							<Typography>Wallet</Typography>
							<Typography>
								Pay ${getTotalCartValue(items)} of available $
								{localStorage.getItem('balance')}
							</Typography>
						</Box>

						<Button
							startIcon={<CreditCard />}
							onClick={() => {
								performCheckout(token, items, addresses);
							}}
							variant="contained"
						>
							PLACE ORDER
						</Button>
					</Box>
				</Grid>
				<Grid item xs={12} md={3} bgcolor="#E9F5E1">
					<Cart isReadOnly products={products} items={items} />
				</Grid>
			</Grid>
			<Footer />
		</>
	);
};

export default Checkout;
