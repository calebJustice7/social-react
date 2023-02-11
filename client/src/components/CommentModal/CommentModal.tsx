import './CommentModal.css';
import {SwipeableDrawer, IconButton} from '@mui/material';
import axios from "../../utils/axios";
import {useState, useEffect, useContext} from "react";
import {ThemeCtx} from "../../App";
import { SendOutlined } from '@mui/icons-material';
import User from "./../../types/User";
import Comments from "./../../types/Comments";
const drawerBleeding = 56;

interface Props {
    isOpen: boolean,
    hideComments: Function,
    postId: string,
    user: User | undefined
}

function CommentPage(props: Props) {
    const themeCtx = useContext(ThemeCtx);
    const [open, setOpen] = useState(false);
    const [comment, setComment] = useState<string>("");
    const [comments, setComments] = useState<Array<Comments>>([]);

    useEffect(() => {
        setOpen(props.isOpen);
        if (props.isOpen) {
            fetchComments();
        }
    }, [props.isOpen])
  
    const toggleDrawer = (newOpen: boolean) => () => {
      setOpen(newOpen);
    };
  
    const container = window !== undefined ? () => window.document.body : undefined;

    function fetchComments() {
        axios.get("/api/comment/" + props.postId).then(res => {
            setComments(res.data);
        })
    }

    function hideDrawer() { 
        toggleDrawer(false);
        props.hideComments();
    }

    function saveComment() {
        if (!comment || !comment.length) return;
        axios.post("/api/comment", {
            postId: props.postId,
            userId: localStorage.getItem("uid"),
            comment: comment
        }).then(() => {
            setComment("");
            fetchComments();
        }).catch(() => {
            console.log("er");
        })
    }

    function getCommentsHtml() {
        return comments.map((comment, idx) => {
            return <div className="comment" key={idx}>
                <div className="profile">
                    <div className="profile-picture">
                        <img src={comment.user.profilePicture} />
                    </div>
                </div>
                <div className="content">
                    <div>{comment.user.username}</div>
                    <div>{comment.comment}</div>
                </div>
            </div>
        })
    }

    return (
        <div className="comment-modal-wrapper">
            <SwipeableDrawer
                container={container}
                anchor="bottom"
                className="comment-popup-wrapper"
                open={open}
                onClose={hideDrawer}
                onOpen={toggleDrawer(true)}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={true}
                ModalProps={{
                    keepMounted: true,
                    sx: {
                        background: 'transparent'
                    }
                }}
            >
                <div style={{maxHeight: '60vh'}}>
                    <div className="puller"></div>
                </div>
                <div className="comments-wrapper">
                    {getCommentsHtml()}
                </div>
                <div className="input-box">
                    <div>
                        <img className="profile-picture" src={props.user ? props.user.profilePicture : ''} />
                        <input value={comment} onChange={e => setComment(e.target.value)} type="text" placeholder="Say something..." />
                    </div>
                    {/* <button onClick={saveComment}>Save</button> */}
                    <IconButton onClick={saveComment}>
                        <SendOutlined />
                    </IconButton>
                </div>
            </SwipeableDrawer>
        </div>
    );
}

export default CommentPage;
