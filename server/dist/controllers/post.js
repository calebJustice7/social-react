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
exports.getPost = exports.likePost = exports.getPosts = exports.deletePost = exports.uploadPost = void 0;
const cloudinary_1 = __importDefault(require("./../config/cloudinary"));
const Post_1 = require("./../models/Post");
const mongoose_1 = __importDefault(require("mongoose"));
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
            },
            {
                $lookup: {
                    from: "comments",
                    foreignField: "postId",
                    localField: "_id",
                    as: "comments"
                }
            },
            {
                $unwind: "$comments",
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "comments.userId",
                    as: "comments.user"
                }
            },
            {
                $unwind: "$comments.user"
            },
            {
                $group: {
                    _id: "$_id",
                    user: { $first: "$user" },
                    caption: { $first: "$caption" },
                    userId: { $first: "$userId" },
                    username: { $first: "$username" },
                    likes: { $first: "$likes" },
                    comments: { $push: "$comments" },
                    createdAt: { $first: "$createdAt" },
                    imgUrl: { $first: "$imgUrl" }
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);
        return posts;
    });
}
function _getPost(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        const oid = new mongoose_1.default.Types.ObjectId(postId);
        const posts = yield Post_1.Post.aggregate([
            {
                $match: {
                    _id: oid
                }
            },
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
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);
        return posts[0];
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
function _deletePost(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        const deleteRes = yield Post_1.Post.deleteOne({ _id: postId });
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
 * @route Delete /:id
 */
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    _deletePost(req.params.id)
        .then(() => {
        res.status(200).json({ success: true });
    })
        .catch((er) => {
        console.log(er);
        res.status(500).send({ message: "Error deleting post" });
    });
});
exports.deletePost = deletePost;
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
/**
 * @route GET /:id
 */
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    _getPost(req.params.id)
        .then((post) => {
        res.status(200).json(post);
    })
        .catch((er) => {
        console.log(er);
        res.status(500).send({ message: "Error getting post" });
    });
});
exports.getPost = getPost;
//# sourceMappingURL=post.js.map