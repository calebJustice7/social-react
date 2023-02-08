import { Request, Response } from "express";
import cloudinary from "./../config/cloudinary";
import {Post, PostDocument} from "./../models/Post";
import {User, UserDocument} from "./../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

interface UploadBody {
    userId: string
    data: string
}

interface CreateUserBody {
    username: string,
    password: string,
    email: string
}

interface AuthBody {
    user: UserDocument,
    token: string
}

async function _setProfilePicture(reqBody: UploadBody): Promise<boolean> {
    const fileStream = await cloudinary.uploader.uploader.upload(reqBody.data);
    await User.updateOne({_id: reqBody.userId},  {profilePicture: fileStream.url});
    return true;
}

async function _createUser(reqBody: CreateUserBody): Promise<boolean> {
    const existingUser: Array<UserDocument> = await User.find({$or: [{email: reqBody.email}, {username: reqBody.username}]});
    if (existingUser.length) {
        throw new Error("User already exists");
    }
    await bcrypt.genSalt(10, async (err, salt) => {
        await bcrypt.hash(reqBody.password, salt, async (err, hash) => {
            if (err) throw err;
            const user = new User({
                email: reqBody.email,
                password: hash,
                username: reqBody.username
            });
            await user.save();
        });
        if (err) throw err;
    });
    return true;
}

async function _authenticateUser(reqBody): Promise<AuthBody> {
    const user = await User.findOne({email: reqBody.email});
    if (!user) throw new Error("Invalid Credentials");
    const isMatch: boolean = await bcrypt.compare(reqBody.password, user.password);
    let resBody: AuthBody;
    if (!isMatch) {
        throw new Error("Invalid Credentials");
    } else {
        const payload = {
            id: user._id,
            username: user.username
        };
        const token = await jwt.sign(payload,"lsdjflajsd9420dlkaj;skdfsdfasfs90fwlkjflsadjlf;asf", {expiresIn: "60m"});
        resBody = {
            user, 
            token: "Bearer token: " + token
        };
    }
    return resBody;
}

async function _getUser(userId: string): Promise<UserDocument> {
    const user = await User.findOne({_id: userId});
    return user;
}

/**
 * @route POST /
 */
export const createUser = (req: Request, res: Response) => {
    _createUser(req.body)
        .then(() => {
            res.status(200).send("Success");
        })
        .catch((er) => {
            res.status(500).send({message: er.message});
        });
};

/**
 * @route POST /
 */
 export const login = (req: Request, res: Response) => {
    _authenticateUser(req.body)
        .then((auth: AuthBody) => {
            res.status(200).send(auth);
        })
        .catch((er) => {
            res.status(500).send({message: er.message});
        });
};

/**
 * @route POST /profile-picture
 */
 export const setProfilePicture = (req: Request, res: Response) => {
    _setProfilePicture(req.body)
        .then(() => {
            res.status(200).send({success: true});
        })
        .catch((er) => {
            console.log(er);
            res.status(500).send({message: er.message});
        });
};

/**
 * @route get /userId
 */
 export const getUser = (req: Request, res: Response) => {
    _getUser(req.params.id)
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((er) => {
            console.log(er);
            res.status(500).send({message: er.message});
        });
};