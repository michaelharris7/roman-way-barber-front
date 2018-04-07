import { Component } from '@angular/core';
import { NewsPost } from './news.post';

@Component({
  selector: 'news-new',
  templateUrl: 'news-new.component.html',
  styleUrls: ['news.component.css']
})

export class NewsNewComponent {
  newsPost = new NewsPost;
}