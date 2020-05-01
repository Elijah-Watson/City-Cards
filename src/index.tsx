import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const client = new ApolloClient({
	// eslint-disable-next-line no-undef
	uri: process.env.REACT_APP_GRAPHQL_URI
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<Provider store={store}>
			<App />
		</Provider>
	</ApolloProvider>,
	document.getElementById('root')
);
