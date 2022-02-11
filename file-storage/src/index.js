import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react'
ReactDOM.render(
	<BrowserRouter>
		<Provider store={store}>
			<PersistGate persistor={persistor}>
			<App />
			</PersistGate>
		</Provider>
	</BrowserRouter>,
	document.getElementById('root')
);

