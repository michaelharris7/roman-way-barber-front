import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Http } from '@angular/http';
// import { Http, Response, Headers, RequestOptions } from '@angular/http';
// import { Observable } from 'rxjs/Rx';
import { Article } from './article';
import { ArticleService } from './article.service';

@Component({
  selector: 'article-show',
  templateUrl: 'article-show.component.html',
  styleUrls: ['article.component.css'],
  providers: [ ArticleService ]
})

export class ArticleShowComponent implements OnInit {
  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) {}

  @Input() article: Article;

  ngOnInit(): void {
    let articleRequest = this.route.params
        .flatMap((params: Params) =>
          this.articleService.getArticle(+params['id']));
    articleRequest.subscribe(response => this.article = response.json());
  }
}