import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { MarkdownModule } from 'angular2-markdown';
import { Angular2TokenService } from 'angular2-token';
import { AuthenticationService } from './authentication/authentication.service';


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
import { AuthRoutingModule } from './authentication/auth-routing.module';

import { AccountComponent } from './account/account.component';
import { AuthLinksComponent } from './authentication/auth-links.component';
import { AuthenticationModule } from './authentication/authentication.module';

import { RegisterComponent } from './authentication/register/register.component';


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    MarkdownModule.forRoot(),
    NgxPageScrollModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    AuthenticationModule
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

    AccountComponent,
    AuthLinksComponent,

    RegisterComponent
  ],
  providers: [
    ArticleService,
    Angular2TokenService,
    AuthenticationService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}