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
  alertNumber: number = 0;
  alertMessage: string;
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
  alertReset() {
    setTimeout(() => {
      this.alertMessage = "";
      this.registerForm.markAsPristine();
    });
    setTimeout(() => {
      this.alertNumber = 0;
    });
  }
  alertRegistering() {
    setTimeout(() => {
      this.alertMessage = "<p class='alert alert-info mt-4' role='alert'>User account data registering...</p>";
      this.registerForm.markAsPristine();
    });
    setTimeout(() => {
      this.alertNumber = 0;
    });
  }
  alertSubmitted() {
    setTimeout(() => {
      this.alertMessage = "<p class='alert alert-primary mt-4' role='alert'>User account registered successfully. Redirecting now.</p>";
      this.registerForm.markAsPristine();
    });
    setTimeout(() => {
      this.alertNumber = 0;
    });
  }
  alertNetworkError() {
    setTimeout(() => {
      this.alertMessage = "<p class='alert alert-warning mt-4' role='alert'>The user account was not able to be registered due to a network error. Please contact your network administrator or try again later.</p>";
      this.registerForm.markAsPristine();
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


  // Register functions
  submit(value: any) {
    if(!value.name) {
      value.name = 'Anonymous';
    }
    this.alertNumber = 1;
    this.registerAccount(value);
  }
  registerAccount(value: any) {
    this.authService.registerAccount(value.name, value.email, value.password).subscribe(
      res => {
        this.authService.logIn(value.email, value.password)
        .subscribe(
          res => {
            this.userData = this.tokenService.currentUserData;
            this.userType = this.tokenService.currentUserType;
            this.registerAllData();
          },
          err => this.afterFailedRegister(err)
        );
      },
      err => this.afterFailedRegister(err)
    );
  }
  afterFailedRegister(errors: any) {
    if(errors.status !== 0) {
      let parsed_errors = JSON.parse(errors._body).errors;

      for(let attribute in this.registerForm.controls) {
        if (parsed_errors[attribute]) {
          this.registerForm.controls[attribute]
              .setErrors(parsed_errors[attribute]);
        }
      }
      this.registerForm.setErrors(parsed_errors);
    } else {

    console.log('User account server down. Cannot create user at this time.');
    this.alertNumber = 3;
  }
}


  // CommentUser functions
  registerAllData() {
    this.articleService.getCommentUsers()
    .subscribe(
      commentUsers => {
        console.log('Article server found');
        this.commentUsers = commentUsers;

        if(this.commentUsers)
          this.createCommentUserIfNull();
      },
      err => {
        console.log('Article server down. Cannot create comment user at this time.');
        this.alertNumber = 3;
        this.authService.deleteAccount().subscribe(
          res => console.log('User account deleted successfully'),
          err => {
            console.log(err);
            return Observable.throw(err);
          }
        );
      }
    );
  }
  createCommentUserIfNull() {
    if(this.commentUsers) {
      if(!this.matchCommentUser(this.userData.id, this.userType)) {
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
            console.log('There was an error creating the comment user: ' + err);
            this.alertNumber = 3;
            this.authService.deleteAccount().subscribe(
              res => console.log('User account deleted successfully'),
              err => {
                console.log(err);
                return Observable.throw(err);
              }
            );
          }
        );
      } else {
        console.log('Comment user already exists');
        this.getTestimonialUsers();
      }
    }
  }
  matchCommentUser(user_id:number, user_type:string):boolean {
    let match:boolean = false;
    for(let commentUser of this.commentUsers) {
      if((commentUser.user_id === user_id) && (commentUser.user_type === user_type))
        match = true;
    }
    return match;
  }
  deleteUserData() {
    this.articleService.getCommentUsers()
    .subscribe(
      commentUsers => {
        this.commentUsers = commentUsers;
        this.commentUser = this.commentUsers[this.commentUsers.length - 1];

        this.articleService.deleteCommentUser(this.commentUser.id).subscribe(
            res => {
              console.log('Comment user deleted successfully');

              setTimeout(() => {
                this.authService.deleteAccount().subscribe(
                  res => console.log('User account deleted successfully'),
                  err => {
                    console.log(err);
                    return Observable.throw(err);
                  }
                );
              });
            },
            err => {
              console.log(err);
              return Observable.throw(err);
            }
          );
      },
      err => {
        console.log('Article server down. Cannot delete comment user at this time.');
        this.alertNumber = 3;
        this.authService.deleteAccount().subscribe(
          res => console.log('User account deleted successfully'),
          err => {
            console.log(err);
            return Observable.throw(err);
          }
        );
      }
    );
  }


  // testimonialUser functions
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
        console.log('Testimonial server down. Cannot create testimonial user at this time.');
        this.alertNumber = 3;
        this.deleteUserData();
      }
    );
  }
  createTestimonialUserIfNull() {
    if(this.testimonialUsers) {
      if(!this.matchTestimonialUser(this.userData.id, this.userType)) {
        let testimonialUser:TestimonialUser;
        this.testimonialUser.user_id = this.userData.id;
        this.testimonialUser.user_type = this.userType;
        this.testimonialUser.user_name = this.userData.name;
        this.testimonialService.createTestimonialUser(this.testimonialUser).subscribe(
          res => {
            console.log('Testimonial user created successfully');
            this.alertNumber = 2;
            this.redirectToPrevious();
          },
          err => {
            console.log('There was an error creating the testimonial user: ' + err);
            this.alertNumber = 3;
            this.deleteUserData();
          }
        );
      } else {
        console.log('Testimonial user already exists');
        this.alertNumber = 2;
        this.redirectToPrevious();
      }
    }
  }
  matchTestimonialUser(user_id:number, user_type:string):boolean {
    let match:boolean = false;
    for(let testimonialUser of this.testimonialUsers) {
      if((testimonialUser.user_id === user_id) && (testimonialUser.user_type === user_type))
        match = true;
    }
    return match;
  }
}