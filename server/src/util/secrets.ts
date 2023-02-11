export const env: string = "PROD";

let MONGODB_URI: string;

if (env === "LOCAL") {
    MONGODB_URI = "mongodb://localhost:27017/soial";
} else {
    MONGODB_URI = "mongodb+srv://admin:admin@cluster0.kdzfl.mongodb.net/social?retryWrites=true&w=majority";
}

export default MONGODB_URI;