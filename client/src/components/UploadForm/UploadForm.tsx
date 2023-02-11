// import React from 'react';
import './UploadForm.css';
import {TextField, Card, CardContent, Backdrop, CircularProgress, CardActions, Button, Box, IconButton, Alert} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import {useState, ChangeEvent} from 'react';
import axios from "./../../utils/axios";

interface Props {
    closeModal: Function
}

function UploadForm(props: Props) {

  const [image, setImage] = useState<Object>({});
  const [caption, setCaption] = useState<String>("");
  const [previewImg, setPreviewImg] = useState<string>();
  const [err, setErr] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  function handleImageUpload(e: ChangeEvent<HTMLInputElement>): void {
    let reader = new FileReader();
    e.target.files instanceof FileList ? setImage(e.target.files[0]) : console.log("Error uploading image");
    e.target.files instanceof FileList ? reader.readAsDataURL(e.target.files[0]) : console.log("Err");

    reader.onloadend = () => {
        typeof reader.result === "string" ? setPreviewImg(reader.result) : console.log("Err2");
    };
  }

  function handleCaptionInput(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    setCaption(e.target.value);
  }

  function savePost(): void {
    if (previewImg && caption) {
        setOpen(true);
        axios.post("/api/post", {
            data: previewImg,
            username: localStorage.getItem("username"),
            userId: localStorage.getItem("uid"),
            caption: caption
        }).then(() => {
            setSuccess(true);
            setOpen(false);
            setErr(false);
            setTimeout(() => {
                props.closeModal();
            }, 1000);            
        }).catch((er) => {
            setErr(true);
            setOpen(false);
            setTimeout(() => {
                setErr(false);
            }, 2000); 
        })
    } else {
        setErr(true);
        setTimeout(() => {
            setErr(false);
        }, 2000); 
    }
  }

  return (
    <div className="uploadform-wrapper">
    <Backdrop
      sx={{ color: '#fff', zIndex: 100 }}
      open={open}
      onClick={() => setOpen(false)}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
    {err ? <Alert severity="error">Missing Fields</Alert> : "" }
    {success ? <Alert severity="success">Post Created</Alert> : "" }
      <Card sx={{ minWidth: 375 }}>
        <CardContent>
            <h2>Create Post</h2>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <Button variant="contained" component="label" sx={{marginTop: '10px'}}>
                    Upload
                    <input onChange={e => handleImageUpload(e)} hidden accept="image/*" multiple type="file" />
                </Button>
                <IconButton color="primary" aria-label="upload picture" component="label">
                    <input onChange={e => handleImageUpload(e)} hidden accept="image/*" type="file" />
                    <PhotoCamera />
                </IconButton>
                {previewImg ? <img style={{height: '50px', width: '50px'}} src={previewImg} /> : ""}
            </div>
            <TextField
                onChange={e => handleCaptionInput(e)} 
                value={caption}
                label="Caption"
                multiline
                rows={4}
                variant="standard"
            />
            </Box>
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button disabled={success} onClick={savePost} size="small" variant="contained">Save</Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default UploadForm;