import {
	AddOutlined,
	RemoveOutlined,
	ShoppingCart,
	ShoppingCartOutlined,
} from '@mui/icons-material';
import { Button, IconButton, Stack } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useHistory } from 'react-router-dom';
import './Cart.css';
import './Products.js';

export const generateCartItemsFrom = (cartData, productsData) => {
	let cartArray = [];
	for (let i = 0; i < productsData.length; i++) {
		for (let j = 0; j < cartData.length; j++) {
			if (productsData[i]._id === cartData[j]['productId']) {
				cartArray.push({ ...cartData[j], ...productsData[i] });
			}
		}
	}
	return cartArray.filter((item) => delete item._id); //avoiding the duplication of ID
};

export const getTotalCartValue = (items = []) => {
	if (!items.length) return 0;
	const total = items
		.map((item) => item.cost * item.qty)
		.reduce((total, n) => total + n);
	return total;
};

export const getTotalItems = (items = []) => {
	const totalQty = items.reduce((total, item) => total + item.qty, 0);
	return totalQty;
};

const ItemQuantity = ({
	value,
	handleAdd,
	handleDelete,
	isReadOnly = false,
}) => {
	if (isReadOnly) {
		return <Box>Qty:{value}</Box>;
	}

	return (
		<Stack direction="row" alignItems="center">
			<IconButton size="small" color="primary" onClick={handleDelete}>
				<RemoveOutlined />
			</IconButton>
			<Box padding="0.5rem" data-testid="item-qty">
				{value}
			</Box>
			<IconButton size="small" color="primary" onClick={handleAdd}>
				<AddOutlined />
			</IconButton>
		</Stack>
	);
};

const Cart = ({
	token,
	products,
	items = [],
	handleQuantity,
	isReadOnly = false,
}) => {
	const history = useHistory();

	if (!items.length) {
		return (
			<Box className="cart empty">
				<ShoppingCartOutlined className="empty-cart-icon" />
				<Box color="#aaa" textAlign="center">
					Cart is empty. Add more items to the cart to checkout.
				</Box>
			</Box>
		);
	}

	return (
		<>
			<Box className="cart" bgcolor="white">
				{items.map((item) => (
					<Box key={item.productId}>
						{item.qty > 0 ? (
							<Box display="flex" alignItems="flex-start" padding="1rem">
								<Box className="image-container">
									<img
										src={item.image}
										alt={item.name}
										width="100%"
										height="100%"
									/>
								</Box>
								<Box
									display="flex"
									flexDirection="column"
									justifyContent="space-between"
									height="6rem"
									paddingX="1rem"
								>
									<div>{item.name}</div>
									<Box
										display="flex"
										justifyContent="space-between"
										alignItems="center"
									>
										<ItemQuantity
											isReadOnly={isReadOnly}
											value={item.qty}
											handleAdd={async () => {
												await handleQuantity(
													token,
													items,
													item.productId,
													products,
													item.qty + 1
												);
											}}
											handleDelete={async () => {
												await handleQuantity(
													token,
													items,
													item.productId,
													products,
													item.qty - 1
												);
											}}
										/>
										<Box padding="0.5rem" fontWeight="700">
											${item.cost}
										</Box>
									</Box>
								</Box>
							</Box>
						) : null}
					</Box>
				))}
				<Box
					padding="1rem"
					display="flex"
					justifyContent="space-between"
					alignItems="center"
				>
					<Box color="#3C3C3C" alignSelf="center">
						Order total
					</Box>
					<Box
						color="#3C3C3C"
						fontWeight="700"
						fontSize="1.5rem"
						alignSelf="center"
						data-testid="cart-total"
					>
						${getTotalCartValue(items)}
					</Box>
				</Box>
				{!isReadOnly && (
					<Box display="flex" justifyContent="flex-end" className="cart-footer">
						<Button
							color="primary"
							variant="contained"
							startIcon={<ShoppingCart />}
							className="checkout-btn"
							onClick={() => history.push('/checkout')}
						>
							Checkout
						</Button>
					</Box>
				)}
			</Box>
			<Box margin={'0.5rem'}>
				{isReadOnly && (
					<Box
						marginTop="1rem"
						padding="1rem"
						display="flex"
						flexDirection={'column'}
						justifyContent="flex-start"
						alignItems="space-between"
						bgcolor="white"
					>
						<Box
							color="#3C3C3C"
							alignSelf="flex-start"
							fontWeight="600"
							fontSize="1.15rem"
						>
							Order Details
						</Box>
						<Box
							paddingTop="1rem"
							display="flex"
							justifyContent="space-between"
						>
							<Box color="#3C3C3C">Products</Box>
							<Box color="#3C3C3C" alignSelf="center" data-testid="cart-total">
								{getTotalItems(items)}
							</Box>
						</Box>
						<Box
							paddingTop="1rem"
							display="flex"
							justifyContent="space-between"
						>
							<Box color="#3C3C3C">Subtotal</Box>
							<Box color="#3C3C3C" alignSelf="center" data-testid="cart-total">
								${getTotalCartValue(items)}
							</Box>
						</Box>
						<Box
							paddingTop="1rem"
							display="flex"
							justifyContent="space-between"
						>
							<Box color="#3C3C3C">Shipping charges</Box>
							<Box color="#3C3C3C" alignSelf="center" data-testid="cart-total">
								$0
							</Box>
						</Box>
						<Box
							paddingTop="1rem"
							display="flex"
							justifyContent="space-between"
							fontWeight="600"
						>
							<Box color="#3C3C3C">Total</Box>
							<Box color="#3C3C3C" alignSelf="center" data-testid="cart-total">
								${getTotalCartValue(items)}
							</Box>
						</Box>
					</Box>
				)}
			</Box>
		</>
	);
};

export default Cart;
