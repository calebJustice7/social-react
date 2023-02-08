// import React from 'react';
import './HomePage.css';
import {Button, Dialog, ToggleButton, Popover, Typography, Backdrop, CircularProgress} from '@mui/material';
import UploadForm from "../UploadForm/UploadForm";
// import Dialog from "@mui/material/Dialog";
import {useState, useEffect, useContext, ChangeEvent} from "react";
import axios from "./../../utils/axios";
import Posts from "./../../types/Posts";
import Post from "./../Post/Post";
import {ThemeCtx} from "./../../App";
import User from "./../../types/User";
import {useNavigate} from "react-router-dom";
import profilePicture from "./../../assets/profile-picture.jpeg";

interface Props {
  setTheme: Function,
  user: User | undefined,
  updateUser: Function
}

function HomePage(props: Props) {

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [posts, setPosts] = useState<Array<Posts>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const themeCtx = useContext(ThemeCtx);
  const navigate = useNavigate();

  useEffect(() => {
    let token: String | null = localStorage.getItem('token');
    if (!token) {
      navigate("/signin");
    }
    getPosts();
  }, [open])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setPopupOpen(true);
  };

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  function getPosts() {
    axios.get("/api/post").then((res) => {
      if (res && res.data && res.data.length) {
        if (typeof res.data[0] !== null) {
          setPosts(res.data);
        } 
      }
    })
  }

  function logOut() {
    localStorage.removeItem("username");
    localStorage.removeItem("uid");
    localStorage.removeItem("token");
    navigate("/signin");
  }

  function getPostsHtml() {
    return posts.map((post, idx) => {
      return <Post post={post} key={idx} />
    })
  }

  function handleImageUpload(e: ChangeEvent<HTMLInputElement>): void {
    let reader = new FileReader();
    e.target.files instanceof FileList ? reader.readAsDataURL(e.target.files[0]) : console.log("Err");
    setLoading(true);

    reader.onloadend = () => {
        // typeof reader.result === "string" ? setPreviewImg(reader.result) : console.log("Err2");
        axios.post("/api/user/profile-picture", {data: reader.result, userId: localStorage.getItem("uid")}).then(() => {
          setPopupOpen(false);
          setLoading(false);
          props.updateUser();
        }).catch(() => {
          setLoading(false);
        })
    };
  }

  return (
    <div className="homepage-wrapper" style={{backgroundColor: themeCtx === 'dark' ? '#282c34' : 'whitesmoke'}}>
    <Backdrop
      sx={{ color: '#fff', zIndex: 100 }}
      open={loading}
      onClick={() => setLoading(false)}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
      <header style={{backgroundColor: themeCtx === 'dark' ? '#3f434a' : 'rgb(225, 224, 224)', color: themeCtx === 'light' ? '#3f434a' : 'rgb(225, 224, 224)'}}>
        <div className="left-header">
          {props.user && props.user.profilePicture ? <img className="profile-picture" src={props.user.profilePicture} /> : <img className="profile-picture" src={profilePicture} />}
          <div>React Typescript Social Media</div>
          <ToggleButton
            value="check"
            sx={{backgroundColor: "white", marginLeft: "25px"}}
            color="primary"
            selected={themeCtx === "dark" ? true : false}
            onChange={() => {
              props.setTheme()
            }}
          >
            {themeCtx === "light" ? 'Dark Mode' : 'Light Mode'}
          </ToggleButton>
        </div>
        <div>
        <Button onClick={openModal} variant="contained">Upload</Button>
        <Button sx={{marginLeft: '10px'}} aria-describedby={'popup-id'} variant="contained" onClick={handleClick}>
          Set Profile Picture
        </Button>
        <Popover
          id={'popup-id'}
          open={popupOpen}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={() => setPopupOpen(false)}
          >
            <Typography sx={{ p: 2 }}><input onChange={e => handleImageUpload(e)} accept="image/*" type="file" /></Typography>
          </Popover>
          <Button onClick={logOut} sx={{marginLeft: '10px'}} variant="contained">Logout</Button>
        </div>
      </header>

      <div className="posts-wrapper">
        {getPostsHtml()}
      </div>

      <Dialog
        open={open}
        onClose={closeModal}
      >
        <UploadForm closeModal={closeModal} />
      </Dialog>
    </div>
  );
}

export default HomePage;
