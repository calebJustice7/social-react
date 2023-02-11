import express from "express";
import mongoose from "mongoose";
import MONGODB_URI from "./util/secrets";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
const app = express();
const mongoUrl = MONGODB_URI;

import * as postRoute from "./controllers/post";
import * as userRoute from "./controllers/user";
import * as commentRoute from "./controllers/comments";

const unauthenticatedPaths = ["/api/login", "/api/signup"];

mongoose.connect(mongoUrl).then(
    () => {console.log("Done");},
).catch(err => {
    console.log(`MongoDB connection error. make sure MongoDB is running. ${err}`);
});

app.set("port", 4000);
app.use(cors());
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next) => {
    let verified: boolean;
    if (unauthenticatedPaths.includes(req.path)) {
        next();
        return;
    }

    if (!req.headers.authorization) {
        res.status(500).send({error: "Missing token"});
        return;
    }

    try {
        verified = jwt.verify(req.headers.authorization.split("Bearer token: ")[1], "lsdjflajsd9420dlkaj;skdfsdfasfs90fwlkjflsadjlf;asf");
    } catch(er) {
        res.status(500).send({error: "Invalid Token"});
        return;
    }
    next();
});

app.post("/api/post", postRoute.uploadPost);
app.get("/api/post", postRoute.getPosts);
app.post("/api/signup", userRoute.createUser);
app.get("/api/user/:id", userRoute.getUser);
app.post("/api/login", userRoute.login);
app.post("/api/user/profile-picture", userRoute.setProfilePicture);
app.post("/api/post/like", postRoute.likePost);
app.delete("/api/post/:id", postRoute.deletePost);
app.get("/api/post/:id", postRoute.getPost);
app.post("/api/comment", commentRoute.addComment);
app.get("/api/comment/:id", commentRoute.getComments);

export default app;