import { Button, Tooltip } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddCircleIcon from '@material-ui/icons/AddCircle';
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

export default function ListLevels({ username, levels }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [okAdd,setOkAdd]= React.useState(false);
  const [level, setLevel] = React.useState(
    <p>
      Xóa quyền <b>Admin</b> của người này!
    </p>
  );
  const onOpen=(isAdd= false)=>(event) => {
      if (isAdd) {
        setOkAdd(true)
        setLevel(
          <p>
            Thêm quyền <b>Admin</b> cho người này!
          </p>
        );
      } else {
        setOkAdd(false)
        setLevel(
          <p>
            Xóa quyền <b>Admin</b> của người này!
          </p>
        );
      }
      setAnchorEl(event.currentTarget);
      setOpen((prev) => !prev);
    };
  function handleUpgade() {
    // console.log(username);
    // console.log(okAdd)
    setOpen(false)
    axios
      .put('http://localhost:8080/api/admin/upgrade',
      {username:username,isAdd:okAdd}
      )
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
    // truyền về username trùng với bảng user_role
  }
  return (
    <div component="ul" className={classes.root}>
      <Popper open={open} placement="top-end" anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Typography className={classes.typography}>{level}</Typography>
              <div className={classes.div_btn}>
                <Button onClick={() => setOpen(false)} size="small">
                  Đóng
                </Button>
                <Button
                  onClick={() => handleUpgade()}
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
      {Object.keys(levels).map((level, key) => {
        return (
          <div key={key}>
            {levels.length === 1 ? (
              <li key={key} className={classes.lili}>
                <Chip
                  size="medium"
                  color="secondary"
                  label={levels[level].authority === 'ROLE_USER' ? 'USER' : 'ADMIN'}
                  onDelete={
                    onOpen(true)
                  }
                  className={classes.chip}
                  deleteIcon={<AddCircleIcon />}
                />
              </li>
            ) : (
              <li key={key} className={classes.lili}>
                <Chip
                  size="medium"
                  color={
                    levels[level].authority === 'ROLE_ADMIN' ||
                    levels[level].authority === null
                      ? 'primary'
                      : 'secondary'
                  }
                  label={
                    levels[level].authority === 'ROLE_USER' ? 'USER' : 'ADMIN'
                  }
                  onDelete={
                    !levels[level].authority ||
                    levels[level].authority === 'ROLE_USER'
                      ? undefined
                      : 
                        onOpen(false)
                        
                      
                  }
                  className={!levels[level].authority && classes.chip}
                />
              </li>
            )}
            </div>
        );
      })}
    </div>
  );
}
