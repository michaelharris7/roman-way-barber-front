import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Angular2TokenService } from 'angular2-token';

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
import { TestimonialListComponent } from './testimonials/testimonial-list.component';
import { TestimonialNewComponent } from './testimonials/testimonial-new.component';
import { TestimonialShowComponent } from './testimonials/testimonial-show.component';


const routes: Routes = [
  { path: '',
    component: HomepageComponent,
    pathMatch: 'full'
  },
  { path: 'home', component: HomepageComponent },
  { path: 'logout', component: HomepageComponent },

  { path: 'services', component: ServicesComponent },
  { path: 'services/haircut', component: HaircutComponent },
  { path: 'services/razorcut', component: RazorCutComponent },
  { path: 'services/trim', component: TrimComponent },

  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },

  { path: 'news', component: ArticleListComponent },
  { path: 'news/articles/new', component: ArticleNewComponent },
  { path: 'news/article/:id', component: ArticleShowComponent },

  { path: 'testimonials', component: TestimonialListComponent },
  {
    path: 'testimonials/new',
    component: TestimonialNewComponent,
    canActivate: [ Angular2TokenService ]
  },
  { path: 'testimonial/:id', component: TestimonialShowComponent },
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}