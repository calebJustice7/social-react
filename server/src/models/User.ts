import mongoose from "mongoose";

export type UserDocument = mongoose.Document & {
    username: string;
    email: string;
    password: string;
    profilePicture: string;
};


const UserSchema = new mongoose.Schema<UserDocument>(
    {
        username: { type: String, unique: true },
        email: { type: String, unique: true },
        password: { type: String, unique: false },
        profilePicture: { type: String, unique: false },
    },
    { timestamps: true }
);

export const User = mongoose.model<UserDocument>("User", UserSchema);
