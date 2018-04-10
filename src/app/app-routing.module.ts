import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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

import { TestimonialsComponent } from './testimonials/testimonials.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },

  { path: 'services', component: ServicesComponent },
  { path: 'services/haircut', component: HaircutComponent },
  { path: 'services/shave', component: ShaveComponent },
  { path: 'services/trim', component: TrimComponent },

  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },

  { path: 'news', component: NewsComponent },
  { path: 'news/new', component: NewsNewComponent },
  { path: 'news/post/:id', component: NewsShowComponent },

  { path: 'testimonials', component: TestimonialsComponent }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}