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
exports.getUser = exports.setProfilePicture = exports.login = exports.createUser = void 0;
const cloudinary_1 = __importDefault(require("./../config/cloudinary"));
const User_1 = require("./../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function _setProfilePicture(reqBody) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileStream = yield cloudinary_1.default.uploader.uploader.upload(reqBody.data);
        yield User_1.User.updateOne({ _id: reqBody.userId }, { profilePicture: fileStream.url });
        return true;
    });
}
function _createUser(reqBody) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield User_1.User.find({ $or: [{ email: reqBody.email }, { username: reqBody.username }] });
        if (existingUser.length) {
            throw new Error("User already exists");
        }
        yield bcryptjs_1.default.genSalt(10, (err, salt) => __awaiter(this, void 0, void 0, function* () {
            yield bcryptjs_1.default.hash(reqBody.password, salt, (err, hash) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    throw err;
                const user = new User_1.User({
                    email: reqBody.email,
                    password: hash,
                    username: reqBody.username
                });
                yield user.save();
            }));
            if (err)
                throw err;
        }));
        return true;
    });
}
function _authenticateUser(reqBody) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield User_1.User.findOne({ email: reqBody.email });
        if (!user)
            throw new Error("Invalid Credentials");
        const isMatch = yield bcryptjs_1.default.compare(reqBody.password, user.password);
        let resBody;
        if (!isMatch) {
            throw new Error("Invalid Credentials");
        }
        else {
            const payload = {
                id: user._id,
                username: user.username
            };
            const token = yield jsonwebtoken_1.default.sign(payload, "lsdjflajsd9420dlkaj;skdfsdfasfs90fwlkjflsadjlf;asf", { expiresIn: "60m" });
            resBody = {
                user,
                token: "Bearer token: " + token
            };
        }
        return resBody;
    });
}
function _getUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield User_1.User.findOne({ _id: userId });
        return user;
    });
}
/**
 * @route POST /
 */
const createUser = (req, res) => {
    _createUser(req.body)
        .then(() => {
        res.status(200).send("Success");
    })
        .catch((er) => {
        res.status(500).send({ message: er.message });
    });
};
exports.createUser = createUser;
/**
 * @route POST /
 */
const login = (req, res) => {
    _authenticateUser(req.body)
        .then((auth) => {
        res.status(200).send(auth);
    })
        .catch((er) => {
        res.status(500).send({ message: er.message });
    });
};
exports.login = login;
/**
 * @route POST /profile-picture
 */
const setProfilePicture = (req, res) => {
    _setProfilePicture(req.body)
        .then(() => {
        res.status(200).send({ success: true });
    })
        .catch((er) => {
        console.log(er);
        res.status(500).send({ message: er.message });
    });
};
exports.setProfilePicture = setProfilePicture;
/**
 * @route get /userId
 */
const getUser = (req, res) => {
    _getUser(req.params.id)
        .then((user) => {
        res.status(200).send(user);
    })
        .catch((er) => {
        console.log(er);
        res.status(500).send({ message: er.message });
    });
};
exports.getUser = getUser;
//# sourceMappingURL=user.js.map