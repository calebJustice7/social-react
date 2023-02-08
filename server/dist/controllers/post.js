"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likePost = exports.getPosts = exports.uploadPost = void 0;
const cloudinary_1 = __importDefault(require("./../config/cloudinary"));
const Post_1 = require("./../models/Post");
function _uploadImage(reqBody) {
    return __awaiter(this, void 0, void 0, function* () {
        const uploadedResponse = yield cloudinary_1.default.uploader.uploader.upload(reqBody.data);
        const record = new Post_1.Post({
            userId: reqBody.userId,
            caption: reqBody.caption,
            imgUrl: uploadedResponse.url,
            username: reqBody.username
        });
        yield record.save();
        return true;
    });
}
function _fetchPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        const posts = yield Post_1.Post.aggregate([
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "userId",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            }
        ]);
        return posts;
    });
}
function _likePost(reqBody) {
    return __awaiter(this, void 0, void 0, function* () {
        const post = yield Post_1.Post.findOne({ _id: reqBody.postId });
        if (!post)
            throw new Error("Error finding post");
        if (post.likes.includes(reqBody.userId)) {
            yield Post_1.Post.updateOne({ _id: reqBody.postId }, { $pull: { likes: reqBody.username } });
        }
        else {
            yield Post_1.Post.updateOne({ _id: reqBody.postId }, { $addToSet: { likes: reqBody.username } });
        }
        return true;
    });
}
/**
 * @route POST /
 */
const uploadPost = (req, res) => {
    _uploadImage(req.body)
        .then(() => {
        res.status(200).send("Success");
    })
        .catch((er) => {
        console.log(er);
        res.status(500).send({ message: "Error uploading post" });
    });
};
exports.uploadPost = uploadPost;
/**
 * @route GET /
 */
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    _fetchPosts()
        .then(posts => {
        res.status(200).json(posts);
    })
        .catch((er) => {
        console.log(er);
        res.status(500).send({ message: "Error fetching posts" });
    });
});
exports.getPosts = getPosts;
/**
 * @route GET /
 */
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    _likePost(req.body)
        .then(() => {
        res.status(200).json({ success: true });
    })
        .catch((er) => {
        console.log(er);
        res.status(500).send({ message: "Error liking post" });
    });
});
exports.likePost = likePost;
//# sourceMappingURL=post.js.map