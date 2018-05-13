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
  loadingData: boolean = false;
  submitted: boolean = false;
  resetString: string;
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
  loadingUserAccount() {
    setTimeout(() => {
      this.resetString = "<p class='alert alert-info mt-4' role='alert'>User account data loading...</p>";
    });
  }
  loadingUserDataReset() {
    setTimeout(() => {
      this.loadingData = false;
      this.resetString = "";
    });
  }
  resetSubmit() {
    setTimeout(() => {
      this.resetString = "<p class='alert alert-primary mt-4' role='alert'>User account logged in successfully. Redirecting now.</p>";
    });
  }
  redirectToPrevious() {
    setTimeout(() => {
      this.authService.redirectToPrevious();
    },1000);
  }


  // Login functions
  submit(value: any) {
    this.loadingData = true;
    this.authService.logIn(value.email, value.password)
    .subscribe(
      res => {
        this.userData = this.tokenService.currentUserData;
        this.userType = this.tokenService.currentUserType;
        this.getCommentUsers();
        this.getTestimonialUsers();
        this.redirectToPrevious()
        this.loadingData = false;
        this.submitted = true;
      },
      err => this.afterFailedUserLogin(value)
    );
  }
  afterFailedUserLogin(value: any) {
    setTimeout(() => {
      let formValues = value;
      console.log(formValues + ', ' + formValues.email);
      this.authService.logInAdmin(formValues.email, formValues.password)
      .subscribe(
        res => {
          this.userData = this.tokenService.currentUserData;
          this.userType = this.tokenService.currentUserType;
          this.getCommentUsers();
          this.getTestimonialUsers();
          this.redirectToPrevious();
          this.loadingData = false;
          this.submitted = true;
        },
        err => this.afterFailedAdminLogin(err)
      );
    });
  }
  afterFailedAdminLogin(errors: any) {
    let parsed_errors = JSON.parse(errors._body).errors;

    for(let attribute in this.loginForm.controls) {
      if (parsed_errors[attribute]) {
        this.loginForm.controls[attribute]
            .setErrors(parsed_errors[attribute]);
      }
    }
    this.loginForm.setErrors(parsed_errors);

    this.loadingData = false;
  }


  // CommentUser functions
  createCommentUserIfNull() {
    if(this.commentUsers) {
      if(!this.searchCommentUser(this.userData.id, this.userType)) {
        let commentUser:CommentUser;
        this.commentUser.user_id = this.userData.id;
        this.commentUser.user_type = this.userType;
        this.commentUser.user_name = this.userData.name;
        this.articleService.createCommentUser(this.commentUser).subscribe(
          res => console.log('Comment User created successfully'),
          err => console.log(err)
          );
      } else {
        console.log('Comment user already exists');
      }
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
  getCommentUsers() {
    this.articleService.getCommentUsers()
    .subscribe(
      commentUsers => {
        console.log('Comment user server found');
        this.commentUsers = commentUsers;

        if(this.commentUsers)
          this.createCommentUserIfNull();
      },
      err => console.log('Article server down. Cannot create comment user at this time.')
    );
  }


  // TestimonialUser functions
  createTestimonialUserIfNull() {
    if(this.testimonialUsers) {
      if(!this.searchTestimonialUser(this.userData.id, this.userType)) {
        let testimonialUser:TestimonialUser;
        this.testimonialUser.user_id = this.userData.id;
        this.testimonialUser.user_type = this.userType;
        this.testimonialUser.user_name = this.userData.name;
        this.testimonialService.createTestimonialUser(this.testimonialUser).subscribe(
          res => console.log('Testimonial User created successfully'),
          err => console.log(err)
          );
      } else {
        console.log('Testimonial user already exists');
      }
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
  getTestimonialUsers() {
    this.testimonialService.getTestimonialUsers()
    .subscribe(
      testimonialUsers => {
        console.log('Testimonial server found');
        this.testimonialUsers = testimonialUsers;

        if(this.testimonialUsers)
          this.createTestimonialUserIfNull();
      },
      err => console.log('Testimonial server down. Cannot create comment user at this time.')
    );
  }
}