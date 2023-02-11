import mongoose from "mongoose";

export type CommentDocument = mongoose.Document & {
    postId: mongoose.Schema.Types.ObjectId;
    comment: string;
    userId: mongoose.Schema.Types.ObjectId;
};


const commentSchema = new mongoose.Schema<CommentDocument>(
    {
        comment: { type: String, unique: false, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, unique: false },
        postId: { type: mongoose.Schema.Types.ObjectId, unique: false },
    },
    { timestamps: true }
);

export const Comment = mongoose.model<CommentDocument>("Comment", commentSchema);
