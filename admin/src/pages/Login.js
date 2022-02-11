import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography
} from '@material-ui/core';

import axios from 'axios';
const Login = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Login | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              username: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string()
                .max(255)
                .required('Vui lòng nhập tài khoản'),
              password: Yup.string().max(255).required('Vui lòng nhập mật khẩu')
            })}
            // onSubmit={() => {
            //   navigate('/admin/dashboard', { replace: true });
            // }}
            onSubmit={(values, actions) => {
              axios
                .post(`http://localhost:8080/api/admin/signin`, {
                  username: values.username,
                  password: values.password
                })
                .then(function (response) {
                  console.log(response.data.body);
                  if (response.data.body === null) {
                    actions.setErrors({
                      username: 'Sai thông tin đăng nhập!',
                      password: 'Sai thông tin đăng nhập!'
                    });
                  } else {
                    localStorage.setItem('isAuthen', true);
                    navigate('/admin/dashboard', { replace: true });
                    window.location.reload();
                  }
                })
                .catch(function (error) {
                  console.log('sai pass rồi');
                  actions.setErrors({
                    username: 'Sai thông tin đăng nhập!',
                    password: 'Sai thông tin đăng nhập!'
                  });
                });
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography color="textPrimary" variant="h2">
                    ĐĂNG NHẬP
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Chào mừng bạn đã quay trở lại!
                  </Typography>
                </Box>

                <TextField
                  error={Boolean(touched.username && errors.username)}
                  fullWidth
                  helperText={touched.username && errors.username}
                  label="Tài khoản"
                  margin="normal"
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Mật khẩu"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    // disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    ĐĂNG NHẬP
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  );
};

export default Login;
