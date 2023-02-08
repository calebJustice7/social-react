"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("cloudinary"));
const ccloudinary = cloudinary_1.default.v2;
ccloudinary.config({
    cloud_name: "dtzputkae",
    api_secret: "OxA6XrccdIQG3hen1T35vQPsR1w",
    api_key: "251322357686573"
});
class Cloudinary {
    constructor(instance) {
        this.uploader = instance;
    }
}
const c = new Cloudinary(ccloudinary);
exports.default = c;
//# sourceMappingURL=cloudinary.js.map