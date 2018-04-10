import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Article } from './article';
import { ArticleService } from './article.service';

@Component({
  selector: 'article-list',
  templateUrl: 'article-list.component.html',
  styleUrls: ['article.component.css'],
  providers: [ ArticleService ]
})

export class ArticleListComponent implements OnInit {
  articles: Article[];
  errorMessage: string;
  mode = "Observable";

  constructor(
    private articleService: ArticleService
  ) {}

  ngOnInit() {
    let timer = Observable.timer(0, 5000);
    timer.subscribe(() => this.getArticles());
  }

  getArticles() {
    this.articleService.getArticles()
        .subscribe(
          articles => this.articles = articles,
          error => this.errorMessage = <any>error
        );
  }
}