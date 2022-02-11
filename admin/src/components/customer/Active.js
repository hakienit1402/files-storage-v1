import { Button, Tooltip } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import React from 'react';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    listStyle: 'none',
    alignItems: 'center',
    margin: 0
  },
  lili: {
    marginRight: theme.spacing(0.5)
  },
  typography: {
    padding: '10px 10px 0 10px'
  },
  div_btn: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  chip: {
    '& span': {
      paddingLeft: 10
    }
  }
}));

export default function Active({ is_active, email }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState(
    <p>
      Xóa quyền <b>Admin</b> của người này!
    </p>
  );
  const onOpen = (isActive = false) =>
    (event) => {
      if (isActive) {   
        setTitle(
          <p>
            Kích hoạt <b>Tài khoản</b> cho người này!
          </p>
        );
      } else {
        setTitle(
          <p>
            Ngưng kích hoạt <b>Tài khoản</b> của người này!
          </p>
        );
      }
      setAnchorEl(event.currentTarget);
      setOpen((prev) => !prev);
    };
    const handleActive = () =>{
        setOpen(false)
        axios.put('http://localhost:8080/api/admin/active',
        email,
        {
          headers:{ 
          'Content-Type': 'text/plain'
        }
        })
        .then(function (response) {
          // handle success
          console.log(response);
          window.location.reload()
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .then(function () {
          // always executed
        });
        // console.log(email)
      }
  return (
    <div component="ul" className={classes.root}>
      <Popper open={open} placement="top-end" anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Typography className={classes.typography}>{title}</Typography>
              <div className={classes.div_btn}>
                <Button onClick={() => setOpen(false)} size="small">
                  Đóng
                </Button>
                <Button
                    onClick={()=>handleActive()}
                  size="small"
                  color="secondary"
                >
                  Đồng ý
                </Button>
              </div>
            </Paper>
          </Fade>
        )}
      </Popper>
      {is_active === false ? (
        <div onClick={onOpen(true)}><Chip size="medium" label="Tạm ẩn" style={{ cursor: 'pointer' }} /></div>
      ) : (
          <div onClick={onOpen(false)}>
        <Chip
          label="Hoạt động"
          size="medium"
          style={{
            cursor: 'pointer',
            backgroundColor: 'green',
            color: 'white'
          }}
        />
        </div>
      )}
    </div>
  );
}
