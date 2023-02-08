import User from "./User"

export default interface Posts {
    _id: string,
    imgUrl: string,
    caption: String,
    username: String
    userId: string,
    likes: Array<String>,
    user: User
}