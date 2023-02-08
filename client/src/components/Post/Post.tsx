import './Post.css';
import {Button, Dialog, List, ListSubheader, IconButton} from '@mui/material';
import {FavoriteBorderOutlined, ChatBubbleOutline, SendOutlined, MoreVertOutlined, FavoriteBorderTwoTone} from '@mui/icons-material';
import Posts from "./../../types/Posts";
import {ThemeCtx} from "./../../App";
import {useContext, useReducer} from "react";
import axios from "./../../utils/axios";
import profilePicture from "./../../assets/profile-picture.jpeg";

interface Props {
    post: Posts
}

function Login(props: Props) {

  const themeCtx = useContext(ThemeCtx);
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  async function likePost() {
    if (props.post.likes.includes(localStorage.getItem("username") || "")) {
        props.post.likes = props.post.likes.filter(a => a !== localStorage.getItem("username"));
    } else {
        props.post.likes.push(localStorage.getItem("username") || "");
    }
    forceUpdate();
    await axios.post("/api/post/like", {postId: props.post._id, username: localStorage.getItem("username")});
  }

  return (
    <div className="post-wrapper">
        <List
            sx={{ width: '40%', borderRadius: '8px', margin: '30px auto', backgroundColor: themeCtx === 'dark' ? '#282c34' : 'whitesmoke', color: themeCtx === 'light' ? '#282c34' : 'whitesmoke' }}
            component="nav"
            className="card"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" className="nested-list-subheader" id="nested-list-subheader" sx={{textAlign: 'left', fontSize: '1.1em', backgroundColor: themeCtx === 'dark' ? '#282c34' : 'whitesmoke', color: themeCtx === 'light' ? '#282c34' : 'whitesmoke'}}>
                    <div className="user-wrapper">
                        {props.post.user.profilePicture ? <img className="profile-picture" src={props.post.user.profilePicture} /> : <img className="profile-picture" src={profilePicture} /> }
                        <div>{props.post.username}</div>
                    </div>
                    <MoreVertOutlined />
                </ListSubheader>
            }
        >
            <img src={props.post.imgUrl} />
            <div className="border"></div>
            <div className="likes" style={{textAlign: 'left', marginLeft: '20px', fontWeight: '500', marginTop: '13px', marginBottom: '2px'}}>
                {props.post.likes.length === 1 ? props.post.likes[0] + ' Likes this' : props.post.likes.length > 1 ? props.post.likes[0] + ' And ' + (props.post.likes.length - 1) + ' Others like this' : '0 Likes'}
            </div>
            <div className="icon-row">
                {
                    props.post.likes.includes(localStorage.getItem("username") || "") ? 
                    <FavoriteBorderTwoTone sx={{bgColor: 'red', color: 'red'}} onClick={likePost} className="icon" /> :
                    <FavoriteBorderOutlined onClick={likePost} className="icon" />
                }
                <ChatBubbleOutline className="icon" />
                <SendOutlined className="icon" />
            </div>
            <div className="caption">
                <div>{props.post.username}</div>
                <div style={{textAlign: 'left'}}>{props.post.caption}</div>
            </div>
        </List>
    </div>
  );
}

export default Login;
