import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPageScrollModule } from 'ngx-page-scroll';


import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';

import { ServicesComponent } from './services/services.component';
import { HaircutComponent } from './services/haircut/haircut.component';
import { ShaveComponent } from './services/shave/shave.component';
import { TrimComponent } from './services/trim/trim.component';

import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

import { NewsComponent } from './news/news.component';
import { NewsNewComponent } from './news/news-new.component';
import { NewsShowComponent } from './news/news-show.component';
import { NewsService } from './news/news.service';

import { TestimonialsComponent } from './testimonials/testimonials.component';

import { AppRoutingModule } from './app-routing.module';


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule.forRoot(),
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

    NewsComponent,
    NewsNewComponent,
    NewsShowComponent,

    TestimonialsComponent
  ],
  providers: [
    NewsService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}