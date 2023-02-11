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
exports.addComment = exports.getComments = void 0;
const Comment_1 = require("./../models/Comment");
const mongoose_1 = __importDefault(require("mongoose"));
function _addComment(reqBody) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = new Comment_1.Comment({
            userId: reqBody.userId,
            postId: reqBody.postId,
            comment: reqBody.comment
        });
        yield comment.save();
        return true;
    });
}
function _fetchComments(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        const comments = yield Comment_1.Comment.aggregate([
            {
                $match: {
                    postId: new mongoose_1.default.Types.ObjectId(postId)
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
    });
}
/**
 * @route get /:id
 */
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    _fetchComments(req.params.id)
        .then((comments) => {
        res.status(200).json(comments);
    })
        .catch((er) => {
        console.log(er);
        res.status(500).send({ message: "Error fetching comments" });
    });
});
exports.getComments = getComments;
/**
 * @route post /
 */
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    _addComment(req.body)
        .then(() => {
        res.status(200).json({ success: true });
    })
        .catch((er) => {
        console.log(er);
        res.status(500).send({ message: "Error creating comment" });
    });
});
exports.addComment = addComment;
//# sourceMappingURL=comments.js.map