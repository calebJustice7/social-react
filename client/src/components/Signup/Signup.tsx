import './Signup.css';
import {Button, TextField, InputAdornment, Alert} from '@mui/material';
import {AccountCircle, Visibility} from '@mui/icons-material';
import {useState} from "react";
import axios from "./../../utils/axios";

interface Props {
    setShowLogin: Function
}

function Signup(props: Props) {

  const [error, setError] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  function signUp() {
    let errMsg: string = "";
    if (!username) errMsg = "Must have a Username";
    if (!password) errMsg = "Must have a Password";
    if (!email) errMsg = "Must have an Email";
    if (errMsg) {
        setError(errMsg);
        setTimeout(() => {
          setError("");
        }, 2000);
        return;
    }
    axios.post("/api/signup", { username, password, email }).then((res) => {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        props.setShowLogin(true);
      }, 2000);
    }).catch((err) => {
      setError(JSON.parse(err.request.response).message);
      setTimeout(() => {
        setError("");
      }, 2000);
    })
  }

  return (
    <div className="signup-wrapper">
        {error ? <Alert sx={{width: '40%', margin: '0 auto 10px auto'}} severity="error">{error}</Alert> : "" }
        {success ? <Alert sx={{width: '40%', margin: '0 auto 10px auto'}} severity="success">Account Created</Alert> : "" }
        <TextField
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="text-field"
          label="Username"
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
          label="Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
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
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
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
            <Button onClick={signUp} variant='contained'>Sign Up</Button>
        </div>
        <div className="no-account">
            Have an account? <span onClick={() => props.setShowLogin(true)}>Sign In</span>
        </div>
    </div>
  );
}

export default Signup;
