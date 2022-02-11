import {
  Avatar,

  Card,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import MoneyIcon from '@material-ui/icons/Money';
import { useEffect, useState } from 'react';
import { getTotal } from './RootRequest';

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
const Budget = (props) => {
  const [data, setData] = useState(0);
  useEffect(() => {
    getTotal('memories')
      .then(res => setData(res))
  }, []);
  return (
    <Card
      sx={{ height: '100%' }}
      {...props}
    >
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
              TỔNG BỘ NHỚ
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {formatBytes(data)}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: red[600],
                height: 56,
                width: 56
              }}
            >
              <MoneyIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}


export default Budget;
