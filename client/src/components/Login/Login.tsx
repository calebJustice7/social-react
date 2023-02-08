import './Login.css';
import {Button, TextField, InputAdornment, Alert} from '@mui/material';
import {AccountCircle, Visibility} from '@mui/icons-material';
import {useState} from "react";
import Signup from '../Signup/Signup';
import axios from "./../../utils/axios";
import {useNavigate} from "react-router-dom";

function Login() {

  const [showLogin, setShowLogin] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  function signIn() {
    axios.post("/api/login", { email: username, password }).then((res) => {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('uid', res.data.user._id);
      localStorage.setItem('username', res.data.user.username);
      navigate("/");
    }).catch(() => {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
    })
  }

  function nav() {
    // useNavigate("/");
  }

  return (
    <div className="login-wrapper">
      <div className="form">
        <header>Welcome to React Social Media</header>
          { showLogin ? <div className="login-form">
            {error ? <Alert sx={{width: '40%', margin: '0 auto 10px auto'}} severity="error">Incorrect Credentials</Alert> : "" }
            <TextField
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="text-field"
              label="Email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              variant="standard"
            />
            <br></br>
            <TextField
              className="text-field"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              label="Password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Visibility />
                  </InputAdornment>
                ),
              }}
              variant="standard"
            />
            <div className="buttons-wrapper">
              <Button onClick={signIn} variant='contained'>Sign In</Button>
            </div>
            <div className="no-account">
              No account? <span onClick={() => setShowLogin(false)}>Sign Up</span>
            </div>
          </div> : <Signup setShowLogin={setShowLogin} /> }
      </div>
      <div className="bg-image">

      </div>
    </div>
  );
}

export default Login;
