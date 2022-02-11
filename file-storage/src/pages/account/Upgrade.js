import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import Header from '../../component/header/Header';
import UpgradeGrid from '../../component/upgrade/UpgradeGrid';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary,
		marginTop: '5rem',
		height: '450px',
	},
	titlePR: {
		textAlign: 'center',
	},
	typography: {
		backgroundColor: '#fff',
		height: '100vh',
	},
}));

function Upgrade() {
	const classes = useStyles();
	return (
		<React.Fragment>
			<CssBaseline />
			<Header />
			<Container maxWidth="md">
				<Typography component="div" className={classes.typography}>
					<div className={classes.titlePR}>
						<div>
							<h3 style={{marginTop:20,textTransform:'uppercase',color:'#525252'}}>Chọn gói nâng cấp phù hợp với bạn</h3>
						</div>
					</div>
					<div className={classes.root}>
						<UpgradeGrid />
					</div>
				</Typography>
			</Container>
		</React.Fragment>
	);
}

export default Upgrade;