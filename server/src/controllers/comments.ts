import { Request, Response } from "express";
import {Comment, CommentDocument} from "./../models/Comment";
import mongoose from "mongoose";

async function _addComment(reqBody): Promise<boolean> {
    const comment = new Comment({
        userId: reqBody.userId,
        postId: reqBody.postId,
        comment: reqBody.comment
    });
    await comment.save();
    return true;
}

async function _fetchComments(postId: string): Promise<Array<CommentDocument>> {
    const comments = await Comment.aggregate([
        {
            $match: {
                postId: new mongoose.Types.ObjectId(postId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        }
    ]);
    return comments;
}

/**
 * @route get /:id
 */
 export const getComments = async (req: Request, res: Response) => {

    _fetchComments(req.params.id)
        .then((comments: Array<CommentDocument>) => {
            res.status(200).json(comments);
        })
        .catch((er) => {
            console.log(er);
            res.status(500).send({message: "Error fetching comments"});
        });
};

/**
 * @route post /
 */
 export const addComment = async (req: Request, res: Response) => {

    _addComment(req.body)
        .then(() => {
            res.status(200).json({success: true});
        })
        .catch((er) => {
            console.log(er);
            res.status(500).send({message: "Error creating comment"});
        });
};