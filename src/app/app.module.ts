import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { MarkdownModule } from 'angular2-markdown';


import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';

import { ServicesComponent } from './services/services.component';
import { HaircutComponent } from './services/haircut/haircut.component';
import { ShaveComponent } from './services/shave/shave.component';
import { TrimComponent } from './services/trim/trim.component';

import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

import { ArticleListComponent } from './news/article-list.component';
import { ArticleNewComponent } from './news/article-new.component';
import { ArticleShowComponent } from './news/article-show.component';
import { ArticleService } from './news/article.service';

import { TestimonialsComponent } from './testimonials/testimonials.component';

import { AppRoutingModule } from './app-routing.module';


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    MarkdownModule.forRoot(),
    NgxPageScrollModule
  ],
  declarations: [
    AppComponent,
    HomepageComponent,

    ServicesComponent,
    HaircutComponent,
    ShaveComponent,
    TrimComponent,

    AboutComponent,
    ContactComponent,

    ArticleListComponent,
    ArticleNewComponent,
    ArticleShowComponent,

    TestimonialsComponent
  ],
  providers: [
    ArticleService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}