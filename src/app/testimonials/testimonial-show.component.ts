import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Angular2TokenService, UserData } from 'angular2-token';
import { AuthenticationService } from '../authentication/authentication.service';
import { TestimonialService } from './testimonial.service';
// import { FeaturedArticle } from './featured-article';
import { TestimonialUser } from './testimonial-user';
import { Testimonial } from './testimonial';
import { OrderPipe } from 'ngx-order-pipe';


@Component({
  templateUrl: 'testimonial-show.component.html'
})

export class TestimonialShowComponent implements OnInit {
  id: number;
  userType: string;
  userData: UserData = <UserData>{};
  testimonialUser: TestimonialUser = <TestimonialUser>{};
  testimonialUsers: TestimonialUser[];
  testimonials: Testimonial[];
  testimonial: Testimonial = <Testimonial>{}

  ngOnInit() {

  }

}