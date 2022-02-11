import { Doughnut } from 'react-chartjs-2';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  colors,
  useTheme
} from '@material-ui/core';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import PanoramaIcon from '@material-ui/icons/Panorama';
import { useState } from 'react';
import { useEffect } from 'react';
import { getTotal } from './RootRequest';

const TrafficByDevice = (props) => {
  const theme = useTheme();
  const [dataRes, setDataRes] = useState([0, 0, 0]);
  useEffect(() => {
    getTotal('files')
      // m,v,p
      .then(res => setDataRes(res))
  }, [])
  const data = {
    datasets: [
      {
        data: dataRes,
        backgroundColor: [
          colors.indigo[500],
          colors.red[600],
          colors.orange[600]
        ],
        borderWidth: 8,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white
      }
    ],
    labels: ['Nhạc', 'Hình ảnh', 'Video']
  };

  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  const devices = [
    {
      title: 'Nhạc',
      value: dataRes[0],
      icon: MusicNoteIcon,
      color: colors.indigo[500]
    },
    {
      title: 'Hình ảnh',
      value: dataRes[1],
      icon: PanoramaIcon,
      color: colors.red[600]
    },
    {
      title: 'Video',
      value: dataRes[2],
      icon: VideoLibraryIcon,
      color: colors.orange[600]
    }
  ];

  return (
    <Card {...props}>
      <CardHeader title="Thống kê số lượng FILE" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: 'relative'
          }}
        >
          <Doughnut
            data={data}
            options={options}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 2
          }}
        >
          {devices.map(({
            color,
            icon: Icon,
            title,
            value
          }) => (
            <Box
              key={title}
              sx={{
                p: 1,
                textAlign: 'center'
              }}
            >
              <Icon color="action" />
              <Typography
                color="textPrimary"
                variant="body1"
              >
                {title}
              </Typography>
              <Typography
                style={{ color }}
                variant="h2"
              >
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TrafficByDevice;
