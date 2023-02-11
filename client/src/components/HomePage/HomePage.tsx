import './HomePage.css';
import {Dialog, Backdrop, CircularProgress} from '@mui/material';
import UploadForm from "../UploadForm/UploadForm";
import {useState, useEffect, useContext, ChangeEvent} from "react";
import axios from "./../../utils/axios";
import Posts from "./../../types/Posts";
import Post from "./../Post/Post";
import {ThemeCtx} from "./../../App";
import {useNavigate} from "react-router-dom";
import jwt_decode from "jwt-decode";
import DecodedJwt from "./../../types/DecodedJwt";
import User from "./../../types/User";

interface Props {
  user: User | undefined
}

function HomePage(props: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [posts, setPosts] = useState<Array<Posts>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const themeCtx = useContext(ThemeCtx);
  const navigate = useNavigate();

  useEffect(() => {
    let token: string | null = localStorage.getItem('token');
    if (!token) {
      navigate("/signin");
      return;
    }
    const decoded: DecodedJwt = jwt_decode(token);
    if (Date.now() >= decoded.exp * 1000) {
      localStorage.removeItem("uid");
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      navigate("/signin");
      return;
    }
    getPosts();
  }, [open])


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

  function getPostsHtml() {
    return posts.map((post, idx) => {
      return <Post user={props.user} fullScreen={false} isLast={false} removePost={(e: string) => removePost(e)} post={post} key={idx} />
    })
  }

  function removePost(id: string) {
    setPosts(posts.filter(a => a._id !== id));
  }

    return (
        <div className="homepage-wrapper" style={{backgroundColor: themeCtx === 'dark' ? '#282c34' : 'whitesmoke'}}>
            <Backdrop sx={{ color: '#fff', zIndex: 100 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <div className="posts-wrapper">{getPostsHtml()}</div>

            <Dialog open={open} onClose={closeModal}>
                <UploadForm closeModal={closeModal} />
            </Dialog>
        </div>
    );
}

export default HomePage;
