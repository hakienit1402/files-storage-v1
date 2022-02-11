import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useState } from 'react';
import { getTotal } from '../dashboard/RootRequest';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export default function DetailRevenue({ user }) {
    const classes = useStyles();
    const [data, setData] = useState([]);
    useEffect(() => {
        getTotal(`revenues/${user}`)
            .then(res =>setData(res));
    }, [user])
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Số tiền</TableCell>
                        <TableCell align="center">Ngày tạo</TableCell>
                        <TableCell align="center">Ngày hết hạn</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((data) => (
                        <TableRow key={data.id}>
                            <TableCell component="th" scope="row">
                                {data.amount}
                            </TableCell>
                            <TableCell align="center">{data.create_date}</TableCell>
                            <TableCell align="center">{data.expire_date}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}