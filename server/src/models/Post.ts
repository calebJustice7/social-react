import mongoose from "mongoose";

export type PostDocument = mongoose.Document & {
    caption: string;
    imgUrl: string;
    userId: mongoose.Schema.Types.ObjectId;
    username: string;
    likes: Array<string>;
};


const postSchema = new mongoose.Schema<PostDocument>(
    {
        caption: { type: String, unique: false },
        username: { type: String, unique: false },
        imgUrl: { type: String, unique: true },
        userId: { type: mongoose.Schema.Types.ObjectId, unique: false },
        likes: { type: [String], default: []}
    },
    { timestamps: true }
);

export const Post = mongoose.model<PostDocument>("Post", postSchema);
