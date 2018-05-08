import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Angular2TokenService, UserData } from 'angular2-token';
import { TestimonialService } from './testimonial.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { TestimonialUser } from './testimonial-user';
import { Testimonial } from './testimonial';


@Component({
  templateUrl: 'testimonial-new.component.html'
})

export class TestimonialNewComponent {
  submitted: boolean = false;
  userType: string;
  userData: UserData = <UserData>{};
  testimonialUser: TestimonialUser = <TestimonialUser>{};
  testimonialUsers: TestimonialUser[];
  testimonial = new Testimonial;

  constructor(
    private tokenService: Angular2TokenService,
    private testimonialService: TestimonialService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    if(this.isLoggedIn()) {
      this.tokenService.validateToken().subscribe(
        res => {
          this.userData = this.tokenService.currentUserData;
          this.userType = this.tokenService.currentUserType;
          this.getTestimonialUsers();
        },
        err => {
          console.log(err);
          this.logOut();
        }
      );
    }
  }


  submit(value: any) {
    value.testimonial_user_id = this.testimonialUser.id;
    this.testimonialService.createTestimonial(value)
    .subscribe(
      res => {
        console.log(res);
        this.submitted = true;
        this.redirectAfterPosted();
      },
      err => {
        console.log(err);
        console.log("Error saving testimonial")
        return Observable.throw(err);
      }
    );
  }
  redirectAfterPosted() {
    setTimeout(() => {
      this.authService.redirectAfterLogin();
    },1000);
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
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  logOut() {
    this.authService.logOut().subscribe(
        res => { console.log('User signed out successfully'); },
        err => { console.log(err); }
      );
  }
  isAdmin(): boolean {
    return (this.isLoggedIn() && this.userType === 'ADMIN');
  }
}