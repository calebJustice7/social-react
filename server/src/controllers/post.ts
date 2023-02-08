import { Request, Response } from "express";
import cloudinary from "./../config/cloudinary";
import {Post, PostDocument} from "./../models/Post";

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
        }
    ]);
    return posts;
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