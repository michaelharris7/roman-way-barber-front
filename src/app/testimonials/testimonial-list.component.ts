import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Angular2TokenService, UserData } from 'angular2-token';
import { AuthenticationService } from '../authentication/authentication.service';
import { TestimonialService } from './testimonial.service';
import { TestimonialUser } from './testimonial-user';
import { Testimonial } from './testimonial';
import { OrderPipe } from 'ngx-order-pipe';


@Component({
  templateUrl: './testimonial-list.component.html'
})

export class TestimonialListComponent implements OnInit {
  userData: UserData = <UserData>{};
  userType: string;
  testimonialUsers: TestimonialUser[];
  testimonialUser: TestimonialUser = <TestimonialUser>{};
  testimonials: Testimonial[];
  testimonial: Testimonial = <Testimonial> {};
  private timerStopper;
  order: string = 'updated_at';
  paginationTotal: number;
  p: number;
  alertNumber: number = 0;
  alertMessage: string;

  constructor(
    private tokenService: Angular2TokenService,
    private authService: AuthenticationService,
    private testimonialService: TestimonialService,
    private router: Router
  ) {}


  // General Functions
  ngOnInit() {
    this.getTestimonials();
    let timer = Observable.timer(0, 5000);
    this.timerStopper = timer.subscribe(() => {
      this.getTestimonials();
    });
    this.loginVerification();
  }
  ngOnDestroy() {
    this.timerStopper.unsubscribe();
  }


  // Standard Alert functions
  alertReset() {
    this.alertMessage = "";
    this.alertNumber = 0;
  }
  alertNetworkError() {
    this.alertMessage = "<p class='alert alert-warning mt-4' role='alert'>The testimonials aren't able to load due to a network error. Please contact your network administrator or try again later.</p>";
  }
  alertNetworkLoading() {
    this.alertMessage = "<p class='alert alert-info mt-4' role='alert'>The testimonials are loading right now. Please wait for the server to load the testimonials.</p>";
  }


  // Testimonial Functions
  getTestimonials() {
    this.testimonialService.getTestimonials()
      .subscribe(
        testimonials => {
          if(this.alertNumber !== 0) {
            this.alertReset();
          }
          this.testimonials = testimonials;
          this.paginationTotal = this.testimonials.length;
          if(this.testimonials.length === 0) {
            this.alertNumber = 2;
          }
        },
        error => {
          this.alertNumber = 1;
          this.testimonials = [];
          this.testimonialErrors(error);
        }
      );
  }
  deleteTestimonial(id: number) {
    this.testimonialService.deleteTestimonial(id)
        .subscribe(
          result => {
            console.log(result);
            this.getTestimonials();
          },
          error => console.log(error)
        );
  }
  goToShow(testimonial: Testimonial): void {
    let link = ['/testimonial/', testimonial.id];
    this.router.navigate(link);
  }
  testimonialErrors(errors: any) {
    if(errors.status !== 0) {
      console.log('There are no testimonials to load.')
    } else {
      console.log('Testimonial server down.');
      this.alertNumber = 1;
    }
  }


  // TestimonialUser functions
  findTestimonialUserId(user_id:number, user_type:string):number {
    for(let testimonialUser of this.testimonialUsers) {
      if((testimonialUser.user_id === user_id) && (testimonialUser.user_type === user_type))
          return testimonialUser.id;
    }
  }
  getTestimonialUser() {
    let user_id = this.findTestimonialUserId(this.userData.id, this.userType);
    let testimonialUserRequest = this.testimonialService.getTestimonialUser(user_id);
    testimonialUserRequest.subscribe(
      res => this.testimonialUser = res.json(),
      err => console.log(err)
    );
  }
  getTestimonialUsers() {
    this.testimonialService.getTestimonialUsers()
    .subscribe(
      testimonialUsers => {
        this.testimonialUsers = testimonialUsers;

      if(this.testimonialUsers)
        this.getTestimonialUser();
      },
      err => console.log(err)
    );
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