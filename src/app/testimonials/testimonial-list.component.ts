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


  // Testimonial Functions
  getTestimonials() {
    this.testimonialService.getTestimonials()
        .subscribe(
          testimonials => {
            this.testimonials = testimonials;
            this.paginationTotal = this.testimonials.length;
          },
          error => console.log(error)
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