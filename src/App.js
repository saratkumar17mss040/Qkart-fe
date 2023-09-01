import React from 'react';
import ipConfig from './ipConfig.json';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Register from './components/Register';
import Products from './components/Products';
import Login from './components/Login';
import Checkout from './components/Checkout';
import Thanks from './components/Thanks';
import { ThemeProvider } from '@mui/material';
import theme from './theme';

export const config = {
	endpoint: `https://qkart-backend-for-frontend.onrender.com/api/v1`,
};

function App() {
	return (
		<React.StrictMode>
			<ThemeProvider theme={theme}>
				<div className="App">
					<BrowserRouter>
						<Switch>
							<Route exact path="/" component={Products} />
							<Route path="/register" component={Register} />
							<Route path="/login" component={Login} />
							<Route path="/checkout" component={Checkout} />
							<Route path="/thanks" component={Thanks} />
						</Switch>
					</BrowserRouter>
				</div>
			</ThemeProvider>
		</React.StrictMode>
	);
}

export default App;
