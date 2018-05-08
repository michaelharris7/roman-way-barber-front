import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Angular2TokenService, UserData } from 'angular2-token';
import { TestimonialUser } from './testimonial-user';
import { TestimonialService } from './testimonial.service';
import { Testimonial } from './testimonial';
import { AuthenticationService } from '../authentication/authentication.service';


@Component({
  templateUrl: 'testimonial-new.component.html',
  styleUrls: ['testimonial.component.css']
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
          this.getTestimonialUsers();
        },
        err => console.log(err));
      this.userType = this.tokenService.currentUserType;
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


  //TestimonialUser functions
  findTestimonialUserId(user_id:number, user_type:string):number {
    for(let testimonialUser of this.testimonialUsers) {
      if((testimonialUser.user_id === user_id) && (testimonialUser.user_type === user_type))
        console.log('testimonialUser.id:' + testimonialUser.id);
        return testimonialUser.id;
    }
  }
  getTestimonialUser() {
    let user_id = this.findTestimonialUserId(this.userData.id, this.userType);
    console.log(user_id);
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


  //Account Functions
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}