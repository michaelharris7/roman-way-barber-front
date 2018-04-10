import { Component } from '@angular/core';
import { Article } from './article';

@Component({
  selector: 'article-new',
  templateUrl: 'article-new.component.html',
  styleUrls: ['article.component.css']
})

export class ArticleNewComponent {
  article = new Article;
}