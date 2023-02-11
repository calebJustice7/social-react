import User from "./User";

export default interface Comment {
    userId: string,
    postId: string,
    comment: string,
    user: User
}