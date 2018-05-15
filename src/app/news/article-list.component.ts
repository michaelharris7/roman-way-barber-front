import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Article } from './article';
import { Angular2TokenService, UserData } from 'angular2-token';
import { AuthenticationService } from '../authentication/authentication.service';
import { ArticleService } from './article.service';
import { OrderPipe } from 'ngx-order-pipe';


@Component({
  templateUrl: 'article-list.component.html'
})

export class ArticleListComponent implements OnInit {
  user: UserData = <UserData>{};
  userType: string;
  articles: Article[];
  article: Article;
  errorMessage: string;
  private timerStopper;
  order: string = 'updated_at';
  paginationTotal: number;
  p: number;
  alertNumber: number = 0;
  alertMessage: string;

  constructor(
    private tokenService: Angular2TokenService,
    private authService: AuthenticationService,
    private articleService: ArticleService,
    private router: Router
  ) {}


  // General Functions
  ngOnInit() {
    this.getArticles();
    let timer = Observable.timer(0, 5000);
    this.timerStopper = timer.subscribe(() => {
      this.getArticles();
    });
    this.user = this.tokenService.currentUserData;
    this.userType = this.tokenService.currentUserType;
  }
  ngOnDestroy() {
    this.timerStopper.unsubscribe();
  }


  // Standard Alert functions
  alertReset() {
    this.alertMessage = "";
    this.alertNumber = 0;
  }
  alertNetworkError() {
    this.alertMessage = "<p class='alert alert-warning mt-4' role='alert'>The news articles aren't able to load due to a network error. Please contact your network administrator or try again later.</p>";
  }


  //Article Functions
  getArticles() {
    this.articleService.getArticles()
      .subscribe(
        articles => {
          if(this.alertNumber === 1) {
            this.alertReset();
          }
          this.articles = articles;
          this.paginationTotal = this.articles.length;
        },
        error => {
          this.alertNumber = 1;
          this.articles = [];
          this.articleErrors(error);
        }
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
  articleErrors(errors: any) {
    if(errors.status !== 0) {
      console.log('There are no news articles to load.')
    } else {
      console.log('News article server down.');
      this.alertNumber = 1;
    }
  }


  // Account Functions
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  isAdmin(): boolean {
    return (this.isLoggedIn() && this.userType === 'ADMIN');
  }
}