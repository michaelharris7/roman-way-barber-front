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
  templateUrl: 'testimonial-show.component.html',
  styles: [
    `
      blockquote:hover {
      background: white;
      border: 1px solid #c7d3eb;
      border-bottom: 2px solid #c7d3eb;
      border-left: 1em solid #003e80;
    }
    blockquote:active {
      border: 1px solid #c7d3eb;
      border-bottom: 2px solid #c7d3eb;
      border-left: 1em solid #003e80;
    }
    `
  ]
})

export class TestimonialShowComponent implements OnInit {
  id: number;
  userType: string;
  userData: UserData = <UserData>{};
  testimonialUser: TestimonialUser = <TestimonialUser>{};
  testimonialUsers: TestimonialUser[];
  testimonials: Testimonial[];
  returnUrl: string;
  editBtnClicked: boolean = false;

  @Input() testimonial: Testimonial;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: Angular2TokenService,
    private authService: AuthenticationService,
    private testimonialService: TestimonialService
  ) {}

  ngOnInit() {
    this.loginVerification();
    this.getTestimonial();
  }


  // Testimonial Function
  getTestimonial() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/testimonials';
    let testimonialRequest = this.route.params
        .flatMap((params: Params) =>
          this.testimonialService.getTestimonial(+params['id']));
    testimonialRequest.subscribe(response => this.testimonial = response.json());
  }
  updateTestimonial(testimonial: Testimonial) {
    this.editBtnClicked = !this.editBtnClicked;
    this.testimonialService.updateTestimonial(testimonial)
      .subscribe(data => {
        return true
      }, error => {
        console.log('Error edditing Testimonial');
        return Observable.throw(error);
      })
  }
  deleteTestimonial(testimonial: Testimonial) {
    this.testimonialService.deleteTestimonial(this.testimonial.id)
      .subscribe(data => {
        this.router.navigate([this.returnUrl]);
      },
        error => console.log(error));
  }


  // Account Functions
  loginVerification() {
    if(this.isLoggedIn()) {
      this.tokenService.validateToken().subscribe(
        res => {
          this.userData = this.tokenService.currentUserData;
          this.userType = this.tokenService.currentUserType;
        },
        err => {
          console.log('No user logged in. Logging out:' + err);
          this.logOut();
        }
      );
    }
  }
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  logOut() {
    this.authService.logOut().subscribe(
        res => { return true },
        err => { console.log('There was an error in logging out:' + err); }
      );
  }
  isAdmin(): boolean {
    return (this.isLoggedIn() && this.userType === 'ADMIN');
  }
}