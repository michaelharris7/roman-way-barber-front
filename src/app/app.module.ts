import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { RouterModule } from '@angular/router';

import { MarkdownModule } from 'angular2-markdown';
import { AuthenticationModule } from './authentication/authentication.module';
import { AppRoutingModule } from './app-routing.module';
import { AuthRoutingModule } from './authentication/auth-routing.module';


import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { AuthLinksComponent } from './authentication/auth-links.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ServicesComponent } from './services/services.component';
import { HaircutComponent } from './services/haircut/haircut.component';
import { RazorCutComponent } from './services/razorcut/razorcut.component';
import { TrimComponent } from './services/trim/trim.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ArticleListComponent } from './news/article-list.component';
import { ArticleNewComponent } from './news/article-new.component';
import { ArticleShowComponent } from './news/article-show.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';


import { TruncatePipe } from './app.pipe';
import { TimeAgoPipe } from 'time-ago-pipe';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';

import { Angular2TokenService } from 'angular2-token';
import { AuthenticationService } from './authentication/authentication.service';
import { ArticleService } from './news/article.service';
import { TestimonialService } from './testimonials/testimonial.service';



@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgbModule.forRoot(),
    NgxPageScrollModule,
    RouterModule,

    MarkdownModule.forRoot(),
    AuthenticationModule,
    AppRoutingModule,
    AuthRoutingModule,

    OrderModule,
    NgxPaginationModule
  ],
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    AuthLinksComponent,
    HomepageComponent,
    ServicesComponent,
    HaircutComponent,
    RazorCutComponent,
    TrimComponent,
    AboutComponent,
    ContactComponent,
    ArticleListComponent,
    ArticleNewComponent,
    ArticleShowComponent,
    TestimonialsComponent,

    TruncatePipe,
    TimeAgoPipe
  ],
  providers: [
    Angular2TokenService,
    AuthenticationService,
    ArticleService,
    TestimonialService
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule {}