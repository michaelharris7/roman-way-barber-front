export class Comment {
  constructor(
    public id?: number,
    public content?: string,
    public comment_user_id?: number,
    public article_id?: number,
  ) {}
}