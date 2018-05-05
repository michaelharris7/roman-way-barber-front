import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TestimonialUser } from './testimonial-user';
import { TestimonialService } from './testimonial.service';

@Component({
  templateUrl: 'testimonial-new.component.html',
  styleUrls: ['testimonial.component.css']
})

export class TestimonialNewComponent {
  // article = new Article;
  submitted: boolean = false;

  constructor(
    // private articleService: ArticleService,
  ) {}

  // createArticle(article) {
  //   this.submitted = true;
  //   this.articleService.createArticle(article)
  //       .subscribe(
  //         data => { return true },
  //         error => {
  //           console.log("Error saving article");
  //           return Observable.throw(error);
  //         }
  //       );
  // }
}