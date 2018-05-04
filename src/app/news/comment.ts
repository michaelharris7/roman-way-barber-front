// import { CommentUser } from './comment-user';
// import { Article } from './article';

export class Comment {
  constructor(
    public id?: number,
    public content?: string,
    public comment_user_id?: number,
    public article_id?: number,
  ) {}
}