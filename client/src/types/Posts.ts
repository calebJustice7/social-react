import User from "./User"
import Comments from "./Comments";

export default interface Posts {
    _id: string,
    imgUrl: string,
    caption: String,
    username: String
    userId: string,
    likes: Array<String>,
    user: User,
    createdAt: Date,
    comments: Array<Comments>
}