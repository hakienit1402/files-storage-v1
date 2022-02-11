import {
  Avatar,
  Box,
  Card,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Active from './Active';
import ListLevels from './ListLevels';

const CustomerListResults = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [memberlist, setMemberlist] = useState([]);

  // fetch data
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/admin/memberlist')
      .then(function (response) {
        // handle success
        console.log(response.data);
        setMemberlist(response.data);
      })
      .catch(function (error) {
        // handle error
        // console.log(error);
      })
      .then(function () {
        // always executed
      });
  }, []);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  // active
  

  return (
    <Card>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Cấp độ</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {memberlist.slice(0, limit).map((member, index) => (
                <TableRow hover key={index}>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      {/* <Avatar src={member.avatarUrl} sx={{ mr: 2 }}>
                        {getInitials(customer.name)}
                      </Avatar> */}
                      <Typography color="textPrimary" variant="body1">
                        {member.full_name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <ListLevels username={member.username} levels={member.authorities} />
                  </TableCell>
                  <TableCell>
                    <Active email={member.email} is_active={member.enabled}/>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={memberlist.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};


export default CustomerListResults;
