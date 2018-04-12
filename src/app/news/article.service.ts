import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Article } from './article';


@Injectable()
export class ArticleService {
  headers: Headers;
  options: RequestOptions;
  private articlesUrl = 'http://localhost:3001/articles';

  constructor(private http: Http) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: this.headers });
  }

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

  deleteArticle(id: number): Observable<Article> {
    const url = `${this.articlesUrl}/${id}`;
    return this.http.delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateArticle(article: Article): Observable<Article> {
    const url = `${this.articlesUrl}/${article.id}`;
    return this.http.put(url, JSON.stringify(article),
      this.options).map((this.extractData))
          .catch(this.handleError);
  }

  private extractData(res: Response) {
      let body = res.json();
      return body || {};
  }

  private handleError (error: any): Promise<any> {
    console.error('An error occured ', error);
    return Promise.reject(error.message || error);
  }
}