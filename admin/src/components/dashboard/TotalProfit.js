import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import { indigo } from '@material-ui/core/colors';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { useState } from 'react';
import { useEffect } from 'react';
import { getTotal } from './RootRequest';

const formatCurrency = (bytes) => {
  if (bytes === 0) return '0 D';
  const k = 1000;
  const sizes = ['D', 'K', 'M', 'T', 'KT'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
const TotalProfit = (props) => {
  const [data, setData] = useState(0);
  useEffect(() => {
    getTotal('salaries')
      .then(res => setData(res))
  }, []);
  return (
    <Card {...props}>
      <CardContent>
        <Grid
          container
          spacing={3}
          sx={{ justifyContent: 'space-between' }}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              TỔNG DOANH THU
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {formatCurrency(data)}
              {/* {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data)} */}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: indigo[600],
                height: 56,
                width: 56
              }}
            >
              <AttachMoneyIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default TotalProfit;
