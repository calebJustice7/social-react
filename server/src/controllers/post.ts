import { Request, Response } from "express";
import cloudinary from "./../config/cloudinary";
import {Post, PostDocument} from "./../models/Post";
import mongoose from "mongoose";

interface UploadBody {
    userId: string,
    caption: string,
    data: string,
    username: string
}

async function _uploadImage(reqBody: UploadBody): Promise<boolean> {
    const uploadedResponse = await cloudinary.uploader.uploader.upload(reqBody.data);
    const record = new Post({
        userId: reqBody.userId,
        caption: reqBody.caption,
        imgUrl: uploadedResponse.url,
        username: reqBody.username
    });
    await record.save();
    return true;
}

async function _fetchPosts(): Promise<Array<PostDocument>> {
    const posts = await Post.aggregate([
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
                user: {$first: "$user"},
                caption: {$first: "$caption"},
                userId: {$first: "$userId"},
                username: {$first: "$username"},
                likes: {$first: "$likes"},
                comments: {$push: "$comments"},
                createdAt: {$first: "$createdAt"},
                imgUrl: {$first: "$imgUrl"}
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);
    
    return posts;
}

async function _getPost(postId: string): Promise<PostDocument> {
    const oid = new mongoose.Types.ObjectId(postId);
    const posts = await Post.aggregate([
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
}
async function _likePost(reqBody): Promise<boolean> {
    const post = await Post.findOne({_id: reqBody.postId});
    if (!post) throw new Error("Error finding post");
    if (post.likes.includes(reqBody.userId)) {
        await Post.updateOne({_id: reqBody.postId}, {$pull: {likes: reqBody.username}});
    } else {
        await Post.updateOne({_id: reqBody.postId}, {$addToSet: {likes: reqBody.username}});
    }
    return true;
}

async function _deletePost(postId): Promise<boolean> {
    const deleteRes = await Post.deleteOne({_id: postId});
    return true;
}

/**
 * @route POST /
 */
export const uploadPost = (req: Request, res: Response) => {
    _uploadImage(req.body)
        .then(() => {
            res.status(200).send("Success");
        })
        .catch((er) => {
            console.log(er);
            res.status(500).send({message: "Error uploading post"});
        });
};

/**
 * @route Delete /:id
 */
 export const deletePost = async (req: Request, res: Response) => {

    _deletePost(req.params.id)
        .then(() => {
            res.status(200).json({success: true});
        })
        .catch((er) => {
            console.log(er);
            res.status(500).send({message: "Error deleting post"});
        });
};

/**
 * @route GET /
 */
export const getPosts = async (req: Request, res: Response) => {

    _fetchPosts()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch((er) => {
            console.log(er);
            res.status(500).send({message: "Error fetching posts"});
        });
};

/**
 * @route GET /
 */
 export const likePost = async (req: Request, res: Response) => {

    _likePost(req.body)
        .then(() => {
            res.status(200).json({success: true});
        })
        .catch((er) => {
            console.log(er);
            res.status(500).send({message: "Error liking post"});
        });
};

/**
 * @route GET /:id
 */
 export const getPost = async (req: Request, res: Response) => {

    _getPost(req.params.id)
        .then((post: PostDocument) => {
            res.status(200).json(post);
        })
        .catch((er) => {
            console.log(er);
            res.status(500).send({message: "Error getting post"});
        });
};