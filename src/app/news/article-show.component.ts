import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Http } from '@angular/http';
// import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ArticleService } from './article.service';
import { Article } from './article';

@Component({
  selector: 'article-show',
  templateUrl: 'article-show.component.html',
  styleUrls: ['article.component.css']
  // providers: [ ArticleService ]
})

export class ArticleShowComponent implements OnInit {
  id: number;
  routeId: any;
  errorMessage: any;
  returnUrl: string;
  editBtnClicked: boolean = false;

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService
  ) {}

  @Input() article: Article;

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/news';
    this.routeId = this.route.params.subscribe(
      params => {
        this.id = +params['id'];
      }
    )
    let articleRequest = this.route.params
        .flatMap((params: Params) =>
          this.articleService.getArticle(+params['id']));
    articleRequest.subscribe(response => this.article = response.json());
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
}