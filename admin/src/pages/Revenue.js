import { Box, Container } from '@material-ui/core';
import { useState } from 'react';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import RevenueListResults from 'src/components/customer/RevenueListResults';
import { getTotal } from 'src/components/dashboard/RootRequest';
// import customers from 'src/__mocks__/customers';

const Revenue = () => {
  const [revenue, setRevenue] = useState([])
  useEffect(() => {
    getTotal('revenues')
      .then(res => { setRevenue(res) })
  }, [])
  return (
    <>
      <Helmet>
        <title>Doanh Thu</title>
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
            <RevenueListResults revenue={revenue} />
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Revenue;
