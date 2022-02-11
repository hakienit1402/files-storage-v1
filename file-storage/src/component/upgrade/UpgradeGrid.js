import { Button, List, ListItem, ListItemIcon } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/Done';
import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';

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
    // headerUpgrade: {
    //     marginTop: '5rem',
    // },
}));

function UpgradeGrid() {
    const classes = useStyles();
    const dataUsers = useSelector((state) => state.auth);
    var { users } = dataUsers;
    const handlePayment = async (pkg_id) => {
        const config = {
            method: 'post',
            url: `http://localhost:8080/api/user/vnpay`,
            headers: {
                'Authorization': `Bearer ${users.token}`,
                'Content-Type': 'application/json'
            },
            data: {
                "pkg_id": pkg_id,
                "username": users.username
            }
        }
        try {
            const { data } = await axios(config);
            window.location.href = data;
        } catch (err) {
            console.log(err);
        }

    }
    return (
        <Grid container spacing={3}>
            <Grid item xs>
                <Paper className={classes.paper}>
                    <div className="OK">
                        <div className={classes.headerUpgrade}>
                            <h3 style={{ marginTop: 35 }}>15GB </h3>
                            <h4>Miễn Phí</h4>
                            <Button
                                variant="outlined"
                                disabled
                                style={{ marginTop: '2rem' }}
                            >
                                Gói hiện tại
							</Button>
                        </div>
                        <hr></hr>
                        <div>
                            <span
                                style={{
                                    float: 'left',
                                    fontSize: '16px',
                                }}
                            >
                                Bao gồm
							</span>
                            <div className={classes.demo}>
                                <List style={{ marginLeft: '2rem' }}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <DoneIcon
                                                fontSize="large"
                                                color="primary"
                                            />
                                        </ListItemIcon>
                                        <h6> Bộ nhớ 15GB</h6>
                                    </ListItem>
                                </List>
                            </div>
                        </div>
                    </div>
                </Paper>
            </Grid>
            <Grid item xs>
                <Paper className={classes.paper} id="OK">
                    <div style={{ background: 'white', borderRadius: 4, height: '100%' }}>
                        <h6
                            style={{
                                fontSize: '16px', paddingTop: 10
                            }}
                        >
                            Đề xuất
						</h6>
                        <div className={classes.headerUpgrade}>
                            <h3 style={{ marginTop: 20 }}>100GB </h3>

                            <Button
                                onClick={() => handlePayment(2)}
                                variant="contained"
                                color="primary"
                                style={{ color: '#fff', marginTop: '5rem', letterSpacing: 1 }}
                            >
                                45.000đ/ tháng
							</Button>
                        </div>
                        <hr></hr>
                        <div className="sdlfj">
                            <span
                                style={{
                                    float: 'left',
                                    fontSize: '16px',
                                }}
                            >
                                Các tính năng
							</span>
                            <div className={classes.demo}>
                                <List style={{ marginLeft: '2rem' }}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <DoneIcon
                                                fontSize="large"
                                                color="primary"
                                            />
                                        </ListItemIcon>
                                        <h6> Bộ nhớ 100GB</h6>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <DoneIcon
                                                fontSize="large"
                                                color="primary"
                                            />
                                        </ListItemIcon>
                                        <h6> Tiếp cận các chuyên gia</h6>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <DoneIcon
                                                fontSize="large"
                                                color="primary"
                                            />
                                        </ListItemIcon>
                                        <h6> Tùy chọn thêm gia đình</h6>
                                    </ListItem>
                                    <ListItem><ListItemIcon>
                                        <DoneIcon
                                            fontSize="large"
                                            color="primary"
                                        />
                                    </ListItemIcon>
                                        <h6> Lợi ích bổ sung cho thành viên</h6>
                                    </ListItem>
                                </List>
                            </div>
                        </div>
                    </div>
                </Paper>
            </Grid>
            <Grid item xs>
                <Paper className={classes.paper}>
                    <div>
                        <div className={classes.headerUpgrade}>
                            <h3 style={{ marginTop: 35 }}>1 TB </h3>
                            <Button
                             onClick={() => handlePayment(3)}
                                variant="outlined"
                                style={{ marginTop: '4.8rem', letterSpacing: 1 }}
                            >
                                200.000đ/ tháng
							</Button>
                        </div>
                        <hr />
                        <div>
                            <span
                                style={{
                                    float: 'left',
                                    fontSize: '16px',
                                }}
                            >
                                Các tính năng
							</span>
                            <div className={classes.demo}>
                                <List style={{ marginLeft: '2rem' }}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <DoneIcon
                                                fontSize="large"
                                                color="primary"
                                            />
                                        </ListItemIcon>
                                        <h6> Bộ nhớ 1000GB</h6>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <DoneIcon
                                                fontSize="large"
                                                color="primary"
                                            />
                                        </ListItemIcon>
                                        <h6> Tiếp cận các chuyên gia</h6>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <DoneIcon
                                                fontSize="large"
                                                color="primary"
                                            />
                                        </ListItemIcon>
                                        <h6> Tùy chọn thêm gia đình</h6>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <DoneIcon
                                                fontSize="large"
                                                color="primary"
                                            />
                                        </ListItemIcon>
                                        <h6> Lợi ích bổ sung cho thành viên</h6>
                                    </ListItem>
                                </List>
                            </div>
                        </div>
                    </div>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default UpgradeGrid;