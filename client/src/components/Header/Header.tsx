// import React from 'react';
import './Header.css';
import {Button, Dialog, IconButton, Menu, MenuItem, ToggleButton, Popover, Typography, Backdrop, CircularProgress} from '@mui/material';
import UploadForm from "../UploadForm/UploadForm";
import MenuIcon from '@mui/icons-material/Menu';
import {useState, useContext, ChangeEvent} from "react";
import axios from "./../../utils/axios";
import Posts from "./../../types/Posts";
import {ThemeCtx} from "./../../App";
import User from "./../../types/User";
import {useNavigate} from "react-router-dom";
import profilePicture from "./../../assets/profile-picture.jpeg";

interface Props {
    updateUser: Function,
    user: User | undefined,
    setTheme: Function
}

function HomePage(props: Props) {

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const themeCtx = useContext(ThemeCtx);
  const navigate = useNavigate();
  const [anchorElMobile, setAnchorElMobile] = useState<null | HTMLElement>(null);
  const openMobile = Boolean(anchorElMobile);

  const handleClickMobile = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElMobile(event.currentTarget);
  };
  
  const handleCloseMobile = () => {
    setAnchorElMobile(null);
  };

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

  function logOut() {
    localStorage.removeItem("username");
    localStorage.removeItem("uid");
    localStorage.removeItem("token");
    navigate("/signin");
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
        <div className="header-wrapper" style={{backgroundColor: themeCtx === 'dark' ? '#282c34' : 'whitesmoke'}}>
            <Backdrop sx={{ color: '#fff', zIndex: 100 }} open={loading}><CircularProgress color="inherit" /></Backdrop>
            <header style={{backgroundColor: themeCtx === 'dark' ? '#3f434a' : 'rgb(225, 224, 224)', color: themeCtx === 'light' ? '#3f434a' : 'rgb(225, 224, 224)'}}>
                <div className="left-header">
                    {props.user && props.user.profilePicture ? <img className="profile-picture" src={props.user.profilePicture} /> : <img className="profile-picture" src={profilePicture} />}

                    <div className="title">React Social Media</div>

                    <ToggleButton
                        value="check"
                        sx={{backgroundColor: "white", marginLeft: "25px"}}
                        color="primary"
                        selected={themeCtx === "dark" ? true : false}
                        onChange={() => {props.setTheme()}}
                    >
                        {themeCtx === "light" ? 'Dark Mode' : 'Light Mode'}
                    </ToggleButton>
                </div>
                <div>
                    <div className="buttons-wrapper">
                        <Button onClick={openModal} variant="contained">Upload</Button>
                        <Button sx={{marginLeft: '10px'}} aria-describedby={'popup-id'} variant="contained" onClick={handleClick}>Set Profile Picture</Button>
                        <Popover
                            id={'popup-id'} open={popupOpen} anchorEl={anchorEl}
                            anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                            transformOrigin={{vertical: 'top', horizontal: 'left'}}
                            onClose={() => setPopupOpen(false)}
                        >
                            <Typography sx={{ p: 2 }}><input onChange={e => handleImageUpload(e)} accept="image/*" type="file" /></Typography>
                        </Popover>
                        <Button onClick={logOut} sx={{marginLeft: '10px'}} variant="contained">Logout</Button>
                    </div>
                    <IconButton
                        aria-label="more" id="long-button" className="hamburger-button"
                        aria-controls={openMobile ? 'long-menu' : undefined}
                        aria-expanded={openMobile ? 'true' : undefined}
                        aria-haspopup="true" onClick={handleClickMobile}
                        sx={{color: themeCtx === 'dark' ? 'white' : 'black'}}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{'aria-labelledby': 'long-button'}}
                        anchorEl={anchorElMobile} open={openMobile} onClose={handleCloseMobile}
                    >
                        <MenuItem onClick={handleCloseMobile}>
                            <Button onClick={openModal} variant="contained">Upload</Button>    
                        </MenuItem>
                        <MenuItem onClick={handleCloseMobile}>
                            <Button aria-describedby={'popup-id'} variant="contained" onClick={handleClick}>Set Profile Picture</Button>
                            <Popover
                                id={'popup-id'} open={popupOpen} anchorEl={anchorEl}
                                anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                                transformOrigin={{vertical: 'top', horizontal: 'left'}}
                                onClose={() => setPopupOpen(false)}
                            >
                                <Typography sx={{ p: 2 }}><input onChange={e => handleImageUpload(e)} accept="image/*" type="file" /></Typography>
                            </Popover>
                        </MenuItem>
                        <MenuItem onClick={handleCloseMobile}>
                            <Button onClick={logOut} variant="contained">Logout</Button>
                        </MenuItem>
                    </Menu>
                </div>
            </header>

            <Dialog open={open} onClose={closeModal}>
                <UploadForm closeModal={closeModal} />
            </Dialog>
        </div>
  );
}

export default HomePage;
