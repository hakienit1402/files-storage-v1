import {
  Box,

  Card,
  CardContent,
  CardHeader,
  colors, Divider,
  getTableContainerUtilityClass,
  MenuItem,
  Select, useTheme
} from '@material-ui/core';
import { useEffect } from 'react';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getTotal } from './RootRequest';

const years = [2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014];
const Sales = (props) => {
  const theme = useTheme();
  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [
        {
          barThickness: 12,
          maxBarThickness: 10,
          barPercentage: 0.5,
          categoryPercentage: 0.5,
          ticks: {
            fontColor: theme.palette.text.secondary
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary,
            beginAtZero: true,
            min: 0
          },
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: theme.palette.divider,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: theme.palette.divider
          }
        }
      ]
    },
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
  const [year, setYear] = useState(2021);

  const handleChange = (event) => {
    setYear(event.target.value);
  };
  const [baseData, setBaseData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [datas, setDatas] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const data = {
    datasets: [
      {
        backgroundColor: colors.indigo[500],
        data: datas || [],
        label: year
      },
      {
        backgroundColor: colors.deepOrange[300],
        data: baseData || [],
        label: '2021'
      }
    ],
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  };

  useEffect(() => {
    getTotal(`salaries/2021`)
      .then(res => {
        setBaseData(res);
      })
  }, [])
  useEffect(() => {
    if (year === 2021)
      setDatas([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    else
      getTotal(`salaries/${year}`)
        .then(res => {
          setDatas(res);
        })
  }, [year])
  return (
    <Card {...props}>
      <CardHeader
        action={(
          <>
            <span style={{ fontSize: 19 }}>Hiện tại so với năm: </span>
            <Select
              className='okok'
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={year}
              defaultValue={2021}
              onChange={handleChange}
            >
              {years.map((y) => (<MenuItem value={y}>{y}</MenuItem>))}
            </Select>
          </>
        )}
        title="DOANH THU HẰNG NĂM"
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 400,
            position: 'relative'
          }}
        >
          <Bar
            data={data}
            options={options}
          />
        </Box>
      </CardContent>
      <Divider />
    </Card>
  );
};

export default Sales;
