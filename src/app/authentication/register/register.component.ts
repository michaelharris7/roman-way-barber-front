import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { ValidationService } from '../validation.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { ArticleService } from '../../news/article.service';
import { TestimonialService } from '../../testimonials/testimonial.service';
import { Angular2TokenService, UserData } from 'angular2-token';
import { CommentUser } from '../../news/comment-user';
import { TestimonialUser } from '../../testimonials/testimonial-user';


@Component({
  templateUrl: './register.component.html'
})

export class RegisterComponent {
  userData: UserData = <UserData>{};
  userType: string;
  commentUser: CommentUser = <CommentUser>{};
  commentUsers: CommentUser[];
  testimonialUser: TestimonialUser = <TestimonialUser>{};
  testimonialUsers: TestimonialUser[];
  admins: any[];
  registeringData: boolean = false;
  submitted: boolean = false;
  resetString: string;
  registerForm: FormGroup;

  constructor(
    private router: Router,
    private articleService: ArticleService,
    private testimonialService: TestimonialService,
    private tokenService: Angular2TokenService,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    fb: FormBuilder
  ) {
      this.registerForm = fb.group({
        name: [''],
        email: ['', [ValidationService.emailRequired, ValidationService.emailValidator]],
        password: ['', [ValidationService.passwordRequired, ValidationService.passwordValidator]],
        passwordConfirmation: ['', [ValidationService.passwordRequired, ValidationService.passwordValidator]]
      }, {
        validator: ValidationService.passwordMatch
      })
  }


  // General Functions
  registeringUserAccount() {
    setTimeout(() => {
      this.resetString = "<p class='alert alert-info mt-4' role='alert'>User account data registering...</p>";
    });
  }
  registeringUserDataReset() {
    setTimeout(() => {
      this.registeringData = false;
      this.resetString = "";
    });
  }
  resetSubmit() {
    setTimeout(() => {
      this.resetString = "<p class='alert alert-success mt-4' role='alert'>User account created successfully. Redirecting now.</p>";
    });
  }
  redirectToPrevious() {
    setTimeout(() => {
      this.authService.redirectToPrevious();
    },1000);
  }


  // Register functions
  submit(value: any) {
    if(!value.name) {
      value.name = 'Anonymous';
    }
    this.registerAccount(value);
  }
  registerAccount(value: any) {
    this.registeringData = true;
    this.authService.registerAccount(value.name, value.email, value.password).subscribe(
      res => {
        this.authService.logIn(value.email, value.password)
        .subscribe(
          res => {
            this.userData = this.tokenService.currentUserData;
            this.userType = this.tokenService.currentUserType;
            this.getCommentUsers();
            this.getTestimonialUsers();
            this.redirectToPrevious();
            this.registeringData = false;
            this.submitted = true;
          },
          err => this.afterFailedRegister(err)
        );
      },
      err => this.afterFailedRegister(err)
    );
  }
  afterFailedRegister(errors: any) {
    let parsed_errors = JSON.parse(errors._body).errors;

    for(let attribute in this.registerForm.controls) {
      if (parsed_errors[attribute]) {
        this.registerForm.controls[attribute]
            .setErrors(parsed_errors[attribute]);
      }
    }
    this.registerForm.setErrors(parsed_errors);

    this.registeringData = false;
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
      }
    }
  }
  searchCommentUser(user_id:number, user_type:string):boolean {
    let match:boolean = false;
    for(let commentUser of this.commentUsers) {
      if((commentUser.user_id === user_id) && (commentUser.user_type === user_type))
        return match = true;
    }
  }
  getCommentUsers() {
    this.articleService.getCommentUsers()
    .subscribe(
      commentUsers => {
        this.commentUsers = commentUsers;

        if(this.commentUsers)
          this.createCommentUserIfNull();
      },
      err => console.log(err)
    );
  }


  // testimonialUser functions
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
      }
    }
  }
  searchTestimonialUser(user_id:number, user_type:string):boolean {
    let match:boolean = false;
    for(let testimonialUser of this.testimonialUsers) {
      if((testimonialUser.user_id === user_id) && (testimonialUser.user_type === user_type))
        return match = true;
    }
  }
  getTestimonialUsers() {
    this.testimonialService.getTestimonialUsers()
    .subscribe(
      testimonialUsers => {
        this.testimonialUsers = testimonialUsers;

        if(this.testimonialUsers)
          this.createTestimonialUserIfNull();
      },
      err => console.log(err)
    );
  }
}