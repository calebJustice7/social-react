"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const secrets_1 = require("./util/secrets");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
// Create Express server
const app = (0, express_1.default)();
const mongoUrl = secrets_1.MONGODB_URI;
const postRoute = __importStar(require("./controllers/post"));
const userRoute = __importStar(require("./controllers/user"));
const unauthenticatedPaths = ["/api/login", "/api/signup"];
mongoose_1.default.connect(mongoUrl).then(() => { }).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
});
// Express configuration
app.set("port", 4000);
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    let verified;
    if (unauthenticatedPaths.includes(req.path)) {
        next();
        return;
    }
    if (!req.headers.authorization) {
        res.status(500).send({ error: "Missing token" });
        return;
    }
    try {
        verified = jsonwebtoken_1.default.verify(req.headers.authorization.split("Bearer token: ")[1], "lsdjflajsd9420dlkaj;skdfsdfasfs90fwlkjflsadjlf;asf");
    }
    catch (er) {
        res.status(500).send({ error: "Invalid Token" });
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
exports.default = app;
//# sourceMappingURL=app.js.map