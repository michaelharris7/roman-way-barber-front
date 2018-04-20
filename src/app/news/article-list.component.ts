import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Article } from './article';
import { Angular2TokenService, UserData } from 'angular2-token';
import { ArticleService } from './article.service';

@Component({
  selector: 'article-list',
  templateUrl: 'article-list.component.html',
  styleUrls: ['article.component.css'],
  providers: [ ArticleService ]
})

export class ArticleListComponent implements OnInit {
  user: UserData = <UserData>{};
  articles: Article[];
  article: Article;
  errorMessage: string;
  mode = "Observable";

  constructor(
    private tokenService: Angular2TokenService,
    private articleService: ArticleService,
    private router: Router
  ) {}

  ngOnInit() {
    let timer = Observable.timer(0, 5000);
    timer.subscribe(() => this.getArticles());
    this.user = this.tokenService.currentUserData;
  }

  getArticles() {
    this.articleService.getArticles()
        .subscribe(
          articles => this.articles = articles,
          error => this.errorMessage = <any>error
        );
  }

  deleteArticle(id: number) {
    this.articleService.deleteArticle(id)
        .subscribe(
          result => {
            console.log(result);
            this.getArticles();
          },
          error => this.errorMessage = <any>error
        );
  }

  goToShow(article: Article): void {
    let link = ['/news/article', article.id];
    this.router.navigate(link);
  }

  // isAdmin() {
  //   if (this.user.userType === 'AdminUser')
  //   return this.user.email
  // }
}