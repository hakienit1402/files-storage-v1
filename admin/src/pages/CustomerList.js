import { Box, Container } from '@material-ui/core';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import CustomerListResults from 'src/components/customer/CustomerListResults';


const CustomerList = () => {

 return (
  <>
    <Helmet>
      <title>Thành viên</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <Box sx={{ pt: 3 }}>
          <CustomerListResults  />
        </Box>
      </Container>
    </Box>
  </>
);
    }
export default CustomerList;
