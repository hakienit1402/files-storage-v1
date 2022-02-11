import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import ReturnVNPay from './pages/Payment/ReturnVNPay';
const Upgrade = lazy(() => import('./pages/account/Upgrade'));
const SignIn = lazy(() => import('./pages/Auth0/SignIn'));
const SignUp = lazy(() => import('./pages/Auth0/SignUp'));
const MainPage = lazy(() => import('./pages/Main/MainPage'));

const App = () => {
	const data = useSelector((state) => state.auth);
	const { users } = data;

	function PrivateRoute({ children, ...rest }) {
		return (
			<Route
				{...rest}
				render={({ location }) =>
					users ? (
						children
					) : (
						<Redirect
							to={{
								pathname: "/signin",
								state: { from: location }
							}}
						/>
						// <Redirect to='/signin' />
					)
				}
			/>
		);
	}

	return (
		<div>

			<Router>
				<div>
					<Suspense fallback={<div>Loading...</div>}>
						<Switch>
							<Route path="/" exact={true}>
								<SignIn />
							</Route>
							<Route path="/signin" >
								<SignIn />
							</Route>
							<PrivateRoute path="/main">
								<MainPage />
							</PrivateRoute>

							<Route path="/signup" >
								<SignUp />
							</Route>
							<Route path="/returnvnpay" >
								<ReturnVNPay />
							</Route>
							<PrivateRoute
								// exact={true}
								path="/upgrade"
								component={Upgrade}
							/>
						</Switch>
					</Suspense>
				</div>

			</Router>
		</div>
	);
};
export default App;
