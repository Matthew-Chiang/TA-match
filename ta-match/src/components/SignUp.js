import React, { useRef, useState}  from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from "react-router-dom";

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Alert } from '@material-ui/lab';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const [role, setRole] = useState('professor');

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const { signup } = useAuth()
  const emailRef = useRef('')
  const passwordRef = useRef('')
  const fNameRef = useRef('')
  const lNameRef = useRef('')
  const roleRef = useRef('')

  async function handleSubmit(e) {
    e.preventDefault()

    if (emailRef.current.value == ''||passwordRef.current.value==''||fNameRef.current.value==''||lNameRef.current.value==''){
      return setError("Please fill in all required fields")
    }

    try {
      setError("")
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
      fetch(`http://localhost:5000/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            fname: fNameRef.current.value,
            lname: lNameRef.current.value,
            type: roleRef.current.value,
            email: emailRef.current.value,
        }),
      })
      .then((res) => {
          console.log(res);
          if(roleRef.current.value=="professor"){
            history.push("/professor")
          }
          else if(roleRef.current.value=="administrator"){
            history.push("/administrator")
          }
          else if(roleRef.current.value=="chair"){
            history.push("/chair")
          }
          else{
            history.push("/signup")
          }
      })
      .catch((e) => {
          console.log(e);
      });
    } catch {
      setError("Failed to create an account")
    }
    setLoading(false)
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                inputRef={fNameRef}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                inputRef={lNameRef}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                inputRef={emailRef}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                inputRef={passwordRef}
              />
            </Grid>
            <Grid item xs={12}>
            <TextField
                id="role"
                select
                required
                label="Role"
                value={role}
                onChange={handleChange}
                SelectProps={{
                    native: true,
                }}
                fullWidth
                variant="outlined"
                inputRef={roleRef}
                >
                <option value='professor'>Professor</option>
                <option value='administrator'>Administrator</option>
                <option value='chair'>Undergraduate Chair</option>
            </TextField>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="center">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );

}