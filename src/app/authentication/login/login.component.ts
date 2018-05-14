import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidationService } from '../validation.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { ArticleService } from '../../news/article.service';
import { TestimonialService } from '../../testimonials/testimonial.service';
import { Angular2TokenService, Angular2TokenOptions, UserData } from 'angular2-token';
import { CommentUser } from '../../news/comment-user';
import { TestimonialUser } from '../../testimonials/testimonial-user';


@Component({
  templateUrl: './login.component.html'
})

export class LoginComponent {
  userData: UserData = <UserData>{};
  userType: string;
  commentUser: CommentUser = <CommentUser>{};
  commentUsers: CommentUser[];
  testimonialUser: TestimonialUser = <TestimonialUser>{};
  testimonialUsers: TestimonialUser[];
  alertNumber: number = 0;
  alertMessage: string;
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private articleService: ArticleService,
    private testimonialService: TestimonialService,
    private tokenService: Angular2TokenService,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    fb: FormBuilder
  ) {
      this.loginForm = fb.group({
        email: ['', [ValidationService.emailRequired, ValidationService.emailValidator]],
        password: ['', [ValidationService.passwordRequired, ValidationService.passwordValidator]],
        passwordConfirmation: ['', [ValidationService.passwordRequired, ValidationService.passwordValidator]]
      }, {
        validator: ValidationService.passwordMatch
      })
  }


  // General Functions
  alertReset() {
    setTimeout(() => {
      this.alertMessage = "";
      this.loginForm.markAsPristine();
    });
    setTimeout(() => {
      this.alertNumber = 0;
    });
  }
  alertLoading() {
    setTimeout(() => {
      this.alertMessage = "<p class='alert alert-info mt-4' role='alert'>User account data loading...</p>";
      this.loginForm.markAsPristine();
    });
    setTimeout(() => {
      this.alertNumber = 0;
    });
  }
  alertSubmitted() {
    setTimeout(() => {
      this.alertMessage = "<p class='alert alert-primary mt-4' role='alert'>User account logged in successfully. Redirecting now.</p>";
      this.loginForm.markAsPristine();
    });
    setTimeout(() => {
      this.alertNumber = 0;
    });
  }
  alertNetworkError() {
    setTimeout(() => {
      this.alertMessage = "<p class='alert alert-warning mt-4' role='alert'>The user account was not able to be logged into due to a network error. Please contact your network administrator or try again later.</p>";
      this.loginForm.markAsPristine();
    });
    setTimeout(() => {
      this.alertNumber = 0;
    });
  }
  alertSetToReset() {
    setTimeout(() => {
      this.alertNumber = 4;
    });
  }
  redirectToPrevious() {
    setTimeout(() => {
      this.authService.redirectToPrevious();
    },1000);
  }


  // Login functions
  submit(value: any) {
    this.alertNumber = 1;
    this.authService.logIn(value.email, value.password)
    .subscribe(
      res => {
        this.userData = this.tokenService.currentUserData;
        this.userType = this.tokenService.currentUserType;
        this.loginAllData();
      },
      err => this.afterFailedUserLogin(value)
    );
  }
  afterFailedUserLogin(value: any) {
    let formValues = value;
    this.authService.logInAdmin(formValues.email, formValues.password)
    .subscribe(
      res => {
        this.userData = this.tokenService.currentUserData;
        this.userType = this.tokenService.currentUserType;
        this.loginAllData();
      },
      err => {
        this.alertNumber = 3;
        console.log('User account server down. Cannot log user in at this time.');
        this.authService.logOut();
      }
    );
  }
  // afterFailedAdminLogin(errors: any) {
  //   this.alertNumber = 3;
  //   console.log('User account server down. Cannot log user in at this time.');
  //   this.authService.logOut();

  //   let parsed_errors = JSON.parse(errors._body).errors;

  //   for(let attribute in this.loginForm.controls) {
  //     if (parsed_errors[attribute]) {
  //       this.loginForm.controls[attribute]
  //           .setErrors(parsed_errors[attribute]);
  //     }
  //   }
  //   this.loginForm.setErrors(parsed_errors);
  // }


  // CommentUser functions
  loginAllData() {  // getCommentUsers() first
    this.articleService.getCommentUsers()
    .subscribe(
      commentUsers => {
        console.log('Article server found');
        this.commentUsers = commentUsers;

        if(this.commentUsers)
          this.createCommentUserIfNull();
      },
      err => {
        this.alertNumber = 3;
        console.log('Article server down. Cannot load comment user at this time.');
        this.authService.logOut();
      }
    );
  }
  createCommentUserIfNull() {
    if(!this.searchCommentUser(this.userData.id, this.userType)) {
      let commentUser:CommentUser;
      this.commentUser.user_id = this.userData.id;
      this.commentUser.user_type = this.userType;
      this.commentUser.user_name = this.userData.name;
      this.articleService.createCommentUser(this.commentUser).subscribe(
        res => {
          console.log('Comment User created successfully');
          this.getTestimonialUsers();
        },
        err => {
          this.alertNumber = 3;
          console.log('There was an error creating the comment user: ' + err);
          this.authService.logOut();
        }
        );
    } else {
      console.log('Comment user already exists');
      this.getTestimonialUsers();
    }
  }
  searchCommentUser(user_id:number, user_type:string):boolean {
    let match:boolean = false;
    for(let commentUser of this.commentUsers) {
      if((commentUser.user_id === user_id) && (commentUser.user_type === user_type))
        match = true;
    }
    return match;
  }


  // TestimonialUser functions
  getTestimonialUsers() {
    this.testimonialService.getTestimonialUsers()
    .subscribe(
      testimonialUsers => {
        console.log('Testimonial server found');
        this.testimonialUsers = testimonialUsers;

        if(this.testimonialUsers)
          this.createTestimonialUserIfNull();
      },
      err => {
        this.alertNumber = 3;
        console.log('Testimonial server down. Cannot load testimonial user at this time.');
        this.authService.logOut();
      }
    );
  }
  createTestimonialUserIfNull() {
    if(!this.searchTestimonialUser(this.userData.id, this.userType)) {
      let testimonialUser:TestimonialUser;
      this.testimonialUser.user_id = this.userData.id;
      this.testimonialUser.user_type = this.userType;
      this.testimonialUser.user_name = this.userData.name;
      this.testimonialService.createTestimonialUser(this.testimonialUser).subscribe(
        res => {
          console.log('Testimonial User created successfully');
          this.redirectToPrevious(); // Data is loaded successfully
          this.alertNumber = 2;
        },
        err => {
          this.alertNumber = 3;
          console.log('There was an error creating the testimonial user: ' + err);
          this.authService.logOut();
        }
      );
    } else {
      console.log('Testimonial user already exists');
      this.redirectToPrevious(); // Data is loaded successfully
      this.alertNumber = 2;
    }
  }
  searchTestimonialUser(user_id:number, user_type:string):boolean {
    let match:boolean = false;
    for(let testimonialUser of this.testimonialUsers) {
      if((testimonialUser.user_id === user_id) && (testimonialUser.user_type === user_type))
        match = true;
    }
    return match;
  }
}