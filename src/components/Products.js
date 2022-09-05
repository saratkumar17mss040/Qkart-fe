import { Search, SentimentDissatisfied } from '@mui/icons-material';
import {
	CircularProgress,
	Grid,
	InputAdornment,
	TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { config } from '../App';
import Footer from './Footer';
import Header from './Header';
import ProductCard from './ProductCard';
import Cart, { generateCartItemsFrom } from './Cart';
import './Products.css';

const Products = () => {
	const token = localStorage.getItem('token');

	const { enqueueSnackbar } = useSnackbar();
	const [debounceTimeout, setdebounceTimeout] = useState(null);
	const [filteredproducts, setfilteredproducts] = useState([]);
	const [products, setproducts] = useState([]);
	const [items, setItems] = useState([]);
	const [isloading, setloading] = useState(false);

	// Fetch products data and store it
	const performAPICall = async () => {
		setloading(true);

		try {
			let response = await axios.get(`${config.endpoint}/products`);
			setloading(false);
			setproducts(response.data);
			setfilteredproducts(response.data);
		} catch (e) {
			setloading(false);
			if (e.response && e.response.status === 400) {
				enqueueSnackbar(e.response.data.message, { variant: 'error' });
				return null;
			} else {
				enqueueSnackbar('check if backend is running /something went wrong ', {
					variant: 'error',
				});
			}
		}
	};

	// Implement search logic
	const performSearch = async (text) => {
		try {
			let response = await axios.get(
				`${config.endpoint}/products/search?value=${text}`
			);
			setfilteredproducts(response.data);
		} catch (e) {
			if (e.response) {
				if (e.response.status === 404) {
					setfilteredproducts([]);
				}
				if (e.response.status === 500) {
					enqueueSnackbar(e.response.message, { variant: 'error' });
					setfilteredproducts(products);
				}
			} else {
				enqueueSnackbar('check if backend is running /something went wrong ', {
					variant: 'error',
				});
			}
		}
	};

	const debounceSearch = (event, debounceTimeout) => {
		const value = event.target.value;

		if (debounceTimeout) {
			//if any timeout already present clear it
			clearTimeout(debounceTimeout);
		}
		const Timeout = setTimeout(async () => {
			performSearch(value);
			//deboucing every 500ms
		}, 500);
		setdebounceTimeout(Timeout);
	};

	const fetchCart = async (token) => {
		if (!token) return;

		try {
			const response = await axios.get(`${config.endpoint}/cart`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			//generate cart
			return response.data;
		} catch (e) {
			if (e.response) {
				enqueueSnackbar(e.response.data.message, { variant: 'error' });
			} else {
				enqueueSnackbar(
					'Unable to fetchcart check the details if backend is running ',
					{ variant: 'error' }
				);
			}
		}
	};

	// Use effects calls
	useEffect(() => {
		performAPICall();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(async () => {
		const cartData = await fetchCart(token);
		if (cartData) {
			const Cartdetails = generateCartItemsFrom(cartData, products);
			setItems(Cartdetails);
		}
	}, [products]);

	const isItemsInCart = (items, productId) => {
		if (items) {
			return items.findIndex((item) => item.productId === productId) !== -1;
		}
	};

	const addToCart = async (
		token,
		items,
		productId,
		products,
		qty,
		options = { preventDuplicate: false }
	) => {
		if (!token) {
			enqueueSnackbar('Please login in to Add products to Cart ', {
				variant: 'warning',
			});
			return;
		}

		if (options.preventDuplicate && isItemsInCart(items, productId)) {
			enqueueSnackbar('item already in cart ', { variant: 'warning' });
			return;
		}

		try {
			const response = await axios.post(
				`${config.endpoint}/cart`,
				{ productId, qty },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const cartItems = generateCartItemsFrom(response.data, products);
			setItems(cartItems);
		} catch (e) {
			enqueueSnackbar('item already in cart', { variant: 'error' });
			return null;
		}
	};

	return (
		<div>
			<Header>
				<TextField
					className="search-desktop"
					size="small"
					InputProps={{
						className: 'search',
						endAdornment: (
							<InputAdornment position="end">
								<Search color="primary" />
							</InputAdornment>
						),
					}}
					placeholder="Search for items/categories"
					onChange={(e) => debounceSearch(e, debounceTimeout)}
					name="search"
				/>
			</Header>
			<TextField
				className="search-mobile"
				size="small"
				fullWidth
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<Search color="primary" />
						</InputAdornment>
					),
				}}
				placeholder="Search for items/categories"
				onChange={(e) => debounceSearch(e, debounceTimeout)}
				name="search"
			/>
			<Grid container>
				<Grid item className="product-grid" md={token ? 9 : 12}>
					<Box className="hero">
						<p className="hero-heading">
							India’s <span className="hero-highlight">FASTEST DELIVERY</span>{' '}
							to your door step
						</p>
					</Box>
					{isloading ? (
						<Box className="loading">
							{' '}
							<CircularProgress />
							<h4>Loading Products</h4>
						</Box>
					) : (
						<Grid container marginY="1rem" paddingX="1rem" spacing={2}>
							{filteredproducts.length ? (
								filteredproducts.map((product) => (
									<Grid item xs={6} md={3} key={product._id}>
										<ProductCard
											product={product}
											handleAddToCart={() => {
												addToCart(token, items, product._id, products, 1, {
													preventDuplicate: true,
												});
											}}
										/>
									</Grid>
								))
							) : (
								<Box className="loading">
									<SentimentDissatisfied color="action" />
									<h4 style={{ color: '#636363' }}>No products Found</h4>
								</Box>
							)}
						</Grid>
					)}
				</Grid>
				{localStorage.getItem('token') ? (
					<Grid item xs={12} md={3} bgcolor="#E9F5E1">
						<Cart
							token={token}
							products={products}
							items={items}
							handleQuantity={addToCart}
						/>
					</Grid>
				) : null}
			</Grid>
			<Footer />
		</div>
	);
};

export default Products;
