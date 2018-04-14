import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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

import { TestimonialsComponent } from './testimonials/testimonials.component';

import { AccountComponent } from './account/account.component';


// import { ValidateTokenComponent } from './validate-token/validate-token.component';


const routes: Routes = [
  { path: '', component: HomepageComponent, pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
  { path: 'logout', component: HomepageComponent },

  { path: 'services', component: ServicesComponent },
  { path: 'services/haircut', component: HaircutComponent },
  { path: 'services/shave', component: ShaveComponent },
  { path: 'services/trim', component: TrimComponent },

  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },

  { path: 'news', component: ArticleListComponent },
  { path: 'news/articles/new', component: ArticleNewComponent },
  { path: 'news/article/:id', component: ArticleShowComponent },

  { path: 'testimonials', component: TestimonialsComponent },

  { path: 'account', component: AccountComponent }
  // { path: 'auth/validate_token', component: ValidateTokenComponent }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}