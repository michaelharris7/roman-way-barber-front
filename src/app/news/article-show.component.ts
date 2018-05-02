import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Angular2TokenService } from 'angular2-token';
import { AuthenticationService } from '../authentication/authentication.service';
import { ArticleService } from './article.service';
import { Article } from './article';

@Component({
  selector: 'article-show',
  templateUrl: 'article-show.component.html',
  styleUrls: ['article.component.css']
})

export class ArticleShowComponent implements OnInit {
  id: number;
  userType: any;
  routeId: any;
  errorMessage: any;
  returnUrl: string;
  editBtnClicked: boolean = false;

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: Angular2TokenService,
    private authService: AuthenticationService,
    private articleService: ArticleService
  ) {}

  @Input() article: Article;

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/news';
    this.routeId = this.route.params.subscribe(
      params => {
        this.id = +params['id'];
      }
    );
    let articleRequest = this.route.params
        .flatMap((params: Params) =>
          this.articleService.getArticle(+params['id']));
    articleRequest.subscribe(response => this.article = response.json());
    this.userType = this.tokenService.currentUserType;
  }

  update(article: Article) {
    this.editBtnClicked = !this.editBtnClicked;
    this.articleService.updateArticle(article)
      .subscribe(data => {
        return true
      }, error => {
        console.log('Error edditing Article');
        return Observable.throw(error);
      })
  }

  delete(article: Article) {
    this.articleService.deleteArticle(this.article.id)
      .subscribe(data => {
        this.router.navigate([this.returnUrl]);
      },
        error => this.errorMessage = error);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin() {
    return (this.isLoggedIn() && this.userType === 'ADMIN');
  }
}