import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { MarkdownModule } from 'angular2-markdown';
import { Angular2TokenService } from 'angular2-token';


import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
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

import { TruncatePipe } from './app.pipe';

import { AppRoutingModule } from './app-routing.module';

import { LoginFormComponent } from './login-form/login-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { AccountComponent } from './account/account.component';


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
    NavbarComponent,
    FooterComponent,
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

    TestimonialsComponent,

    TruncatePipe,

    LoginFormComponent,
    RegisterFormComponent,
    AccountComponent
  ],
  providers: [
    ArticleService,
    Angular2TokenService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}