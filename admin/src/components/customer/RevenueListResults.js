import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import DetailRevenue from './DetailRevenue';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const RevenueListResults = ({ revenue, ...rest }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  // const handleSelectAll = (event) => {
  //   let newSelectedCustomerIds;

  //   if (event.target.checked) {
  //     newSelectedCustomerIds = revenue.map((revenue) => revenue.username);
  //   } else {
  //     newSelectedCustomerIds = [];
  //   }

  //   setSelectedCustomerIds(newSelectedCustomerIds);
  // };

  // const handleSelectOne = (_, id) => {
  //   const selectedIndex = selectedCustomerIds.indexOf(id);
  //   let newSelectedCustomerIds = [];

  //   if (selectedIndex === -1) {
  //     newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
  //   } else if (selectedIndex === 0) {
  //     newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
  //   } else if (selectedIndex === selectedCustomerIds.length - 1) {
  //     newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelectedCustomerIds = newSelectedCustomerIds.concat(
  //       selectedCustomerIds.slice(0, selectedIndex),
  //       selectedCustomerIds.slice(selectedIndex + 1)
  //     );
  //   }

  //   setSelectedCustomerIds(newSelectedCustomerIds);
  // };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const handleClickOpen = (u) => {
    setUser(u);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.length === revenue.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0
                      && selectedCustomerIds.length < revenue.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell> */}
                <TableCell>
                  Tên
                </TableCell>
                <TableCell>
                  Tiền đổ vào WEB
                </TableCell>
                <TableCell>
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {revenue.slice(0, limit).map((revenue) => (
                <TableRow
                  hover
                  key={revenue.username}
                  selected={selectedCustomerIds.indexOf(revenue.username) !== -1}
                >
                  {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(revenue.username) !== -1}
                      onChange={(event) => handleSelectOne(event, revenue.username)}
                      value="true"
                    />
                  </TableCell> */}
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {revenue.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(revenue.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color="secondary"
                      onClick={() => handleClickOpen(revenue)}
                      avatar={<Avatar>i</Avatar>}
                      label='Chi tiết' size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Dialog
          maxWidth='md'
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">Hóa đơn của: {user.name}</DialogTitle>
          <DialogContent>
            <DetailRevenue user={user.username} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Đóng
          </Button>
          </DialogActions>
        </Dialog>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={revenue.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

RevenueListResults.propTypes = {
  revenue: PropTypes.array.isRequired
};

export default RevenueListResults;
