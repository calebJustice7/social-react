import cloudinary from "cloudinary";
const ccloudinary = cloudinary.v2;
import {UploadApiResponse} from "cloudinary";

ccloudinary.config({
    cloud_name: "",
    api_secret: "",
    api_key: ""
});

type CallbackFunc = (...args: any[]) => Promise<UploadApiResponse>;

interface cloudinary {
    uploader: {
        upload: CallbackFunc
    }
}

class Cloudinary {
    constructor (instance: cloudinary) {
        this.uploader = instance;
    }

    uploader: cloudinary;
}

const c = new Cloudinary(ccloudinary);

export default c;