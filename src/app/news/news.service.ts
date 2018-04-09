import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { NewsPost } from './news-post';

@Injectable()
export class NewsService {
  private newsUrl = 'http://localhost:3000/news.json';

  constructor(
    private http: Http
  ) {}

  getNewsPosts(): Observable<NewsPost[]> {
    return this.http.get(this.newsUrl)
                    .map((response: Response) => <NewsPost[]>response.json())
                    .catch(this.handleError);
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