import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Article } from './article';
import { ArticleService } from './article.service';

@Component({
  selector: 'article-new',
  templateUrl: 'article-new.component.html',
  styleUrls: ['article.component.css']
})

export class ArticleNewComponent {
  article = new Article;
  submitted: boolean = false;

  constructor(
    private articleService: ArticleService,
  ) {}

  createArticle(article) {
    this.submitted = true;
    this.articleService.createArticle(article)
        .subscribe(
          data => { return true },
          error => {
            console.log("Error saving article");
            return Observable.throw(error);
          }
        );
  }
}