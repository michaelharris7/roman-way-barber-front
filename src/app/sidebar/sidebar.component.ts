import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../news/article.service';
import { FeaturedArticle } from '../news/featured-article';
import { AuthenticationService } from '../authentication/authentication.service';


@Component({
  selector: 'sidebar',
  template: `
    <div class="new-sidebar card-box-shadows pt-4 mb-5">
      <div *ngIf="!isLoggedIn()">
        <p>
          <a routerLink="/login">Login</a> or <a routerLink="/register">register</a> to comment on news posts.
        </p>
        <hr>
      </div>

      <h5>
        <a routerLink="/testimonials">Testimonials</a>
      </h5>

        <hr>

      <h5 class="mb-3">Featured Articles</h5>
      <div *ngFor="let featuredArticle of featuredArticles; let first = first; let last = last" [class.new-separator]="!last" [class.pb-2]="!last" [class.pt-2]="!first" [attr.id]="'featuredArticle_' + featuredArticle.id">
        <div class="container new-feature">
          <a pageScroll [pageScrollOffset]="-200" [pageScrollDuration]="200" [pageScrollEasing]="EasingLogic" [pageScrollInterruptible]="false" [routerLink]="'/news/article/' + this.featuredArticle.article_id" href="#article" class="w-100">
            <h6 class="py-1 new-title">
              {{ featuredArticle.title }}
            </h6>
            <p class="new-markdown">
              <markdown data="{{ featuredArticle.content | truncate:[50] }}"></markdown>
            </p>
            <button class="btn btn-outline-secondary btn-sm mt-2 float-right mr-3">Read More</button>
          </a>
        </div>
      </div>
      <br/>
      <a routerLink="/news">More news articles</a>
    </div>
  `
})

export class SidebarComponent implements OnInit {
  featuredArticles: FeaturedArticle[];

  constructor(
    private articleService: ArticleService,
    private authService: AuthenticationService
  ) {}


  ngOnInit() {
    this.getFeaturedArticles();
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

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}