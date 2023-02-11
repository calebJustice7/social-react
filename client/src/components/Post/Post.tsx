import './Post.css';
import {Button, List, Backdrop, CircularProgress, Popover, IconButton} from '@mui/material';
import {FavoriteBorderOutlined, ChatBubbleOutline, DeleteOutline, MoreVertOutlined, FavoriteBorderTwoTone} from '@mui/icons-material';
import Posts from "./../../types/Posts";
import {ThemeCtx} from "./../../App";
import {useContext, useReducer, useState} from "react";
import axios from "./../../utils/axios";
import profilePicture from "./../../assets/profile-picture.jpeg";
import CommentModal from "./../CommentModal/CommentModal";
import User from "./../../types/User";

interface Props {
    post: Posts,
    removePost: Function,
    isLast: boolean,
    fullScreen: boolean,
    user: User | undefined
}

function Login(props: Props) {

  const themeCtx = useContext(ThemeCtx);
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [deleteYN, setDeleteYN] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<boolean>(false);

  async function likePost() {
    if (props.post.likes.includes(localStorage.getItem("username") || "")) {
        props.post.likes = props.post.likes.filter(a => a !== localStorage.getItem("username"));
    } else {
        props.post.likes.push(localStorage.getItem("username") || "");
    }
    forceUpdate();
    await axios.post("/api/post/like", {postId: props.post._id, username: localStorage.getItem("username")});
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setPopupOpen(true);
  };

  function timeSince(date: Date) {

    var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

  function commentPost() {
    setComment(true);
  }
 
  function handleClose() {
    setPopupOpen(false)
    setDeleteYN(false)
  }

  function deletePost() {
    setDeleteYN(true);
  }

  function hideComments() {
    setComment(false);
  }

  function confirmDelete() {
    setLoading(true);
    if (localStorage.getItem("username") !== props.post.username) return;
    axios.delete(`/api/post/${props.post._id}`).then(() => {
      setLoading(false);
      props.removePost(props.post._id);
    }).catch(() => {
      setLoading(false);
    });
  }

  return (
    <div className="post-wrapper" style={{marginBottom: props.isLast ? '200px' : ''}}>
        <Backdrop
          sx={{ color: '#fff', zIndex: 100 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <List
            sx={{ 
              border: themeCtx === 'dark' ? '2px solid rgb(74, 74, 74)' : '2px solid rgb(210, 209, 209)', 
              margin: props.fullScreen ? '0' : '30px auto', 
              backgroundColor: themeCtx === 'dark' ? '#282c34' : 'whitesmoke', 
              color: themeCtx === 'light' ? '#282c34' : 'whitesmoke',
              width: props.fullScreen ? 'calc(100vw - 4px) !important' : '',
              borderRadius: props.fullScreen ? '0px !important' : ''
            }}
            component="nav"
            className="card"
            aria-labelledby="nested-list-subheader"
            // subheader={
        >
                <div className="nested-list-subheader" id="nested-list-subheader" style={{textAlign: 'left', fontSize: '1.1em', backgroundColor: themeCtx === 'dark' ? '#282c34' : 'whitesmoke', color: themeCtx === 'light' ? '#282c34' : 'whitesmoke', borderBottom: themeCtx === 'dark' ? '1px solid rgb(74, 74, 74)' : '1px solid rgb(210, 209, 209)'}}>
                    <div className="user-wrapper">
                        {props.post.user.profilePicture ? <img className="profile-picture" src={props.post.user.profilePicture} /> : <img className="profile-picture" src={profilePicture} /> }
                        <div>
                          <div>{props.post.username}</div>
                        </div>
                    </div>
                    <div className="time-since">
                        <div>{timeSince(new Date(props.post.createdAt))} ago</div>
                        {props.post.username === localStorage.getItem("username") ? <IconButton sx={{color: 'white'}} onClick={handleClick}><MoreVertOutlined /></IconButton> : ""}
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
                          onClose={handleClose}
                          >
                            {deleteYN ? 
                              <Button sx={{backgroundColor: 'red', color: 'white'}} variant="contained" onClick={confirmDelete}>Confirm Delete</Button> : 

                              <Button className="delete-post-wrapper" onClick={deletePost}>
                                Delete
                                <DeleteOutline />
                              </Button>
                            }
                        </Popover>
                    </div>
                </div>
            <img src={props.post.imgUrl} />
            <div className="border" style={{borderTop: themeCtx === 'light' ? '2px solid rgb(210, 209, 209)' : '2px solid rgb(74, 74, 74)'}}></div>
            <div className="likes" style={{textAlign: 'left', marginLeft: '10px', fontWeight: '500', marginTop: '6px', marginBottom: '2px'}}>
                {props.post.likes.length === 1 ? props.post.likes[0] + ' Likes this' : props.post.likes.length > 1 ? props.post.likes[0] + ' And ' + (props.post.likes.length - 1) + ' Others like this' : '0 Likes'}
            </div>
            <div className="icon-row">
                {
                    props.post.likes.includes(localStorage.getItem("username") || "") ? 
                    <FavoriteBorderTwoTone sx={{bgColor: 'red', color: 'red'}} onClick={likePost} className="icon"  /> :
                    <FavoriteBorderOutlined onClick={likePost} className="icon" />
                }
                <ChatBubbleOutline onClick={commentPost} className="icon" />
            </div>
            <div className="caption">
                <span>{props.post.username}</span>
                <span style={{textAlign: 'left'}}>{props.post.caption}</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
              <span style={{textAlign: 'left', marginLeft: '9px', fontWeight: '700', marginTop: '0px', fontSize: '0.75em', marginBottom: '6px'}}>{props.post.comments && props.post.comments.length ? props.post.comments[props.post.comments.length - 1].user ? props.post.comments[props.post.comments.length - 1].user.username : '' : ''}</span>
              <span style={{textAlign: 'left', marginLeft: '9px', fontWeight: '400', marginTop: '0px', fontSize: '0.7em', marginBottom: '6px'}}>{props.post.comments && props.post.comments.length ? props.post.comments[props.post.comments.length - 1].comment : ''}</span>
            </div>
            <div onClick={commentPost} style={{textAlign: 'left', marginLeft: '9px', fontWeight: '400', marginTop: '0px', fontSize: '0.75em', marginBottom: '9px'}}>
                {props.post.comments.length} {props.post.comments.length === 1 ? 'Comment' : 'Comments'}
            </div>
            <div className="time-since-mobile">{timeSince(new Date(props.post.createdAt))} ago</div>
        </List>

        <CommentModal user={props.user} postId={props.post._id} hideComments={hideComments} isOpen={comment ? true : false} />
    </div>
  );
}

export default Login;
