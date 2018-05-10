import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ArticleService } from '../news/article.service';
import { FeaturedArticle } from '../news/featured-article';
import { TestimonialService } from '../testimonials/testimonial.service';
import { FeaturedTestimonial } from '../testimonials/featured-testimonial';
import { AuthenticationService } from '../authentication/authentication.service';


@Component({
  selector: 'sidebar',
  template: `
    <div class="new-sidebar card-shadow-light pt-4 mb-5">
      <div *ngIf="!isLoggedIn()">
        <p>
          <a routerLink="/login">Login</a> or <a routerLink="/register">register</a> to comment on news posts.
        </p>
        <hr>
      </div>

      <h5 class="mb-3">Testimonials</h5>
      <div *ngFor="let featuredTestimonial of featuredTestimonials; let first = first; let last = last" [class.pt-4]="!first" [class.pt-2]="!first" [attr.id]="'featuredTestimonial_' + featuredTestimonial.id">
        <div class="blockquote-sidebar-select">
          <div class="container blockquote-feature">
            <a pageScroll [pageScrollOffset]="-200" [pageScrollDuration]="200" [pageScrollEasing]="EasingLogic" [pageScrollInterruptible]="false" [routerLink]="'/testimonial/' + this.featuredTestimonial.testimonial_id" href="#testimonial" class="w-100">
              <div class="blockquote-sidebar">
                <p>
                  {{ featuredTestimonial.content | truncate:[60] }}
                </p>
                <div class="quote-signature">
                  <em>&nbsp;&#9472; </em>
                  <span *ngIf="featuredTestimonial.custom_user;
                         else standard_user">
                    <em>{{featuredTestimonial.custom_user}}</em>
                  </span>
                  <ng-template #standard_user>
                    <em>{{featuredTestimonial.user_name}}</em>
                  </ng-template>
                </div>
              </div>
            </a>
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <a pageScroll [pageScrollOffset]="-200" [pageScrollDuration]="200" [pageScrollEasing]="EasingLogic" [pageScrollInterruptible]="false" [routerLink]="'/testimonial/' + this.featuredTestimonial.testimonial_id" href="#testimonial">
            <button class="btn btn-outline-secondary btn-sm mt-2 mr-3">
              Read More
            </button>
          </a>
        </div>
      </div>
      <a class="new-link" pageScroll [pageScrollOffset]="100" [pageScrollDuration]="200" [pageScrollEasing]="EasingLogic" [pageScrollInterruptible]="false" [routerLink]="'/testimonials'" href="#testimonial-list">
        <button class="btn btn-outline-info btn-sm mt-4 mb-3">
          More testimonials
        </button>
      </a>

      <hr>

      <h5 class="mb-3">Featured Articles</h5>
      <div *ngFor="let featuredArticle of featuredArticles; let first = first; let last = last" [class.new-separator]="!first" [class.pt-2]="!first" [attr.id]="'featuredArticle_' + featuredArticle.id">
        <div class="new-post-select">
          <div class="container new-feature">
            <a pageScroll [pageScrollOffset]="-200" [pageScrollDuration]="200" [pageScrollEasing]="EasingLogic" [pageScrollInterruptible]="false" [routerLink]="'/news/article/' + this.featuredArticle.article_id" href="#article" class="w-100">
              <h6 class="py-1 new-title">
                {{ featuredArticle.title }}
              </h6>
              <p class="new-markdown">
                <markdown data="{{ featuredArticle.content | truncate:[40] }}"></markdown>
              </p>
            </a>
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <a pageScroll [pageScrollOffset]="-200" [pageScrollDuration]="200" [pageScrollEasing]="EasingLogic" [pageScrollInterruptible]="false" [routerLink]="'/news/article/' + this.featuredArticle.article_id" href="#article">
            <button class="btn btn-outline-secondary btn-sm mt-2 mr-3">
              Read More
            </button>
          </a>
        </div>
      </div>
      <a class="new-link" pageScroll [pageScrollOffset]="100" [pageScrollDuration]="200" [pageScrollEasing]="EasingLogic" [pageScrollInterruptible]="false" [routerLink]="'/news'" href="#article-list">
        <button class="btn btn-outline-info btn-sm mt-4">
          More news articles
        </button>
      </a>
    </div>
  `
})

export class SidebarComponent implements OnInit {
  featuredArticles: FeaturedArticle[];
  featuredTestimonials: FeaturedTestimonial[];
  private timerStopper;

  constructor(
    private articleService: ArticleService,
    private testimonialService: TestimonialService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    let timer = Observable.timer(0, 5000);
    this.timerStopper = timer.subscribe(() => {
         this.getFeaturedArticles();
         this.getFeaturedTestimonials();
        });
  }
  ngOnDestroy() {
    this.timerStopper.unsubscribe();
  }


  getFeaturedArticles() {
    this.articleService.getFeaturedArticles()
    .subscribe(
      featuredArticles => {
        this.featuredArticles = featuredArticles
      },
      error => console.log(error)
    );
  }
  getFeaturedTestimonials() {
    this.testimonialService.getFeaturedTestimonials()
    .subscribe(
      featuredTestimonials => {
        this.featuredTestimonials = featuredTestimonials
      },
      error => console.log(error)
    );
  }
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}