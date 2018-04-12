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
    return this.http.post(this.articlesUrl, JSON.stringify(article),this.options)              .map(this.extractData)
                    .catch(this.handleError);
  }

  deleteArticle(id: number): Observable<Article[]> {
    return this.http.delete(this.articlesUrl + "/" + id + ".json", this.options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
      let body = res.json();
      return body || {};
  }

  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}