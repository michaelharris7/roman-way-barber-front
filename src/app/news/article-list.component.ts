import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Article } from './article';
import { FeaturedArticle } from './featured-article';
import { Angular2TokenService, UserData } from 'angular2-token';
import { AuthenticationService } from '../authentication/authentication.service';
import { ArticleService } from './article.service';


@Component({
  selector: 'article-list',
  templateUrl: 'article-list.component.html',
  styleUrls: ['article.component.css'],
  providers: [ ArticleService ]
})

export class ArticleListComponent implements OnInit {
  user: UserData = <UserData>{};
  userType: string;
  articles: Article[];
  article: Article;
  featuredArticles: FeaturedArticle[];
  errorMessage: string;
  mode = "Observable";
  private timerStopper;
  articleShow: string;

  constructor(
    private tokenService: Angular2TokenService,
    private authService: AuthenticationService,
    private articleService: ArticleService,
    private router: Router
  ) {}


  //General Functions
  ngOnInit() {
    this.getArticles();
    this.getFeaturedArticles();
    let timer = Observable.timer(0, 5000);
    this.timerStopper = timer.subscribe(() => {
      this.getArticles();
      this.getFeaturedArticles();
    });
    this.user = this.tokenService.currentUserData;
    this.userType = this.tokenService.currentUserType;
  }
  ngOnDestroy() {
    this.timerStopper.unsubscribe();
  }


  //Article Functions
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
    let link = ['/news/article/', article.id];
    this.router.navigate(link);
  }

  getFeaturedArticles() {
    this.articleService.getFeaturedArticles()
    .subscribe(
      featuredArticles => {
        this.featuredArticles = featuredArticles
      },
      error => {
        this.errorMessage = <any>error;
        console.log(error);
      }
    );
  }


  //Account Functions
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  isAdmin(): boolean {
    return (this.isLoggedIn() && this.userType === 'ADMIN');
  }
}