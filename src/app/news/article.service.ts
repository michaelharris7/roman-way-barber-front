import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Angular2TokenService, UserData } from 'angular2-token';
import { Article } from './article';
import { CommentUser } from './comment-user';
import { Comment } from './comment';


@Injectable()
export class ArticleService {
  headers: Headers;
  options: RequestOptions;
  private articlesUrl = 'http://localhost:3001/articles';
  private commentUsersUrl = 'http://localhost:3001/comment_users';
  private commentsUrl = 'http://localhost:3001/comments';

  constructor(
    private http: Http,
  ) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: this.headers });
  }


  // Article functions
  getArticles(): Observable<Article[]> {
    return this.http.get(this.articlesUrl)
                    .map(this.extractData)
                    .catch(this.handleError);
  }
  getArticle(id: number) {
    return this.http.get(this.articlesUrl + "/" + id + ".json");
  }
  createArticle(article: Article): Observable<Article> {
    return this.http.post(this.articlesUrl, JSON.stringify(article),
      this.options).map(this.extractData)
          .catch(this.handleError);
  }
  updateArticle(article: Article): Observable<Article> {
    const url = `${this.articlesUrl}/${article.id}`;
    return this.http.put(url, JSON.stringify(article),
      this.options).map((this.extractData))
          .catch(this.handleError);
  }
  deleteArticle(id: number): Observable<Article> {
    const url = `${this.articlesUrl}/${id}`;
    return this.http.delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }


  // CommentUser functions
  getCommentUsers(): Observable<CommentUser[]> {
    return this.http.get(this.commentUsersUrl)
                    .map(this.extractData)
                    .catch(this.handleError);
  }
  getCommentUser(id: number) {
    return this.http.get(this.commentUsersUrl + "/" + id + ".json");
  }
  createCommentUser(commentUser: CommentUser): Observable<CommentUser> {
    return this.http.post(this.commentUsersUrl, JSON.stringify(commentUser),
      this.options).map(this.extractData)
          .catch(this.handleError);
  }
  updateCommentUser(commentUser: CommentUser): Observable<CommentUser> {
    const url = `${this.commentUsersUrl}/${commentUser.id}`;
    return this.http.put(url, JSON.stringify(commentUser),
      this.options).map((this.extractData))
          .catch(this.handleError);
  }
  deleteCommentUser(id: number): Observable<CommentUser> {
    const url = `${this.commentUsersUrl}/${id}`;
    return this.http.delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }


  // Comment functions
  createComment(comment: Comment): Observable<Comment> {
    return this.http.post(this.commentsUrl, JSON.stringify(comment),
      this.options).map(this.extractData)
          .catch(this.handleError);
  }
  updateComment(comment: Comment): Observable<Comment> {
    const url = `${this.commentsUrl}/${comment.id}`;
    return this.http.put(url, JSON.stringify(comment),
      this.options).map((this.extractData))
          .catch(this.handleError);
  }
  deleteComment(id: number): Observable<Comment> {
    const url = `${this.commentsUrl}/${id}`;
    return this.http.delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }


  // General data extraction
  private extractData(res: Response) {
      let body = res.json();
      return body || {};
  }
  private handleError (error: any): Promise<any> {
    console.error('An error occured ', error);
    return Promise.reject(error.message || error);
  }
}