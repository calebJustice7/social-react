"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
exports.env = "PROD";
let MONGODB_URI;
if (exports.env === "LOCAL") {
    MONGODB_URI = "mongodb://localhost:27017/soial";
}
else {
    MONGODB_URI = "mongodb+srv://admin:admin@cluster0.kdzfl.mongodb.net/social?retryWrites=true&w=majority";
}
exports.default = MONGODB_URI;
//# sourceMappingURL=secrets.js.map