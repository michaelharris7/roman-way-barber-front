import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MarkdownService } from 'angular2-markdown';
import { Article } from './article';
import { ArticleService } from './article.service';

@Component({
  selector: 'article-new',
  templateUrl: 'article-new.component.html',
  styleUrls: ['article.component.css'],
  providers: [ ArticleService ]
})

export class ArticleNewComponent implements OnInit {
  article = new Article;
  submitted: boolean = false;

  constructor(
    private articleService: ArticleService,
    private _markdown: MarkdownService
  ) {}

  createArticle(article) {
    this.submitted = true;
    this.articleService.createArticle(article)
        .subscribe(
          data => { return true },
          error => {
            console.log("Error saving proposal");
            return Observable.throw(error);
          }
        );
  }

  ngOnInit() {
    this._markdown.renderer.table = (header: string, body: string) => {
      return `
      <table class="markdown-table">
        <thead>
          ${header}
        </thead>
        <tbody>
          ${body}
        </tbody>
      </table>
      `;
    }
    this._markdown.renderer.blockquote = (quote: string) => {
      return `<blockquote class="markdown-quote">${quote}</blockquote>`;
    }
  }
}