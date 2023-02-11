"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    comment: { type: String, unique: false, required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, unique: false },
    postId: { type: mongoose_1.default.Schema.Types.ObjectId, unique: false },
}, { timestamps: true });
exports.Comment = mongoose_1.default.model("Comment", commentSchema);
//# sourceMappingURL=Comment.js.map