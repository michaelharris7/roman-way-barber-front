import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidationService } from '../validation.service';
import { AuthenticationService } from '../authentication.service';
import { ArticleService } from '../../news/article.service';
import { TestimonialService } from '../../testimonials/testimonial.service';
import { Angular2TokenService, UserData } from 'angular2-token';
import { CommentUser } from '../../news/comment-user';
import { TestimonialUser } from '../../testimonials/testimonial-user';


@Component({
  templateUrl: './account.component.html',
})

export class AccountComponent implements OnInit {
  userData: UserData = <UserData>{};
  userType: string;
  commentUser: CommentUser = <CommentUser>{};
  commentUsers: CommentUser[];
  testimonialUser: TestimonialUser = <TestimonialUser>{};
  testimonialUsers: TestimonialUser[];
  updatingData: boolean = false;
  submitted: boolean = false;
  resetString: string;
  deletingData: boolean = false;
  deletionError: boolean = false;
  deletionString: string;
  accountFormBasic: FormGroup;
  accountFormPassword: FormGroup;
  formBasicSet: boolean = true;
  deleteConfirm: boolean = false;
  deleteConfirmed: boolean = false;

  constructor(
    private articleService: ArticleService,
    private testimonialService: TestimonialService,
    private tokenService: Angular2TokenService,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private fb: FormBuilder
  ) {
      this.userData.name = '';
      this.userData.email = 'test@test.com';

      this.accountFormBasic = fb.group({
        name: [this.userData.name],
        email: [this.userData.email, [ValidationService.emailRequired, ValidationService.emailValidator]]
      }, {});

      this.accountFormPassword = fb.group({
        name: [this.userData.name],
        email: [this.userData.email, [ValidationService.emailRequired, ValidationService.emailValidator]],
        password: ['', [ValidationService.passwordRequired, ValidationService.passwordValidator]],
        passwordConfirmation: ['', [ValidationService.passwordRequired, ValidationService.passwordValidator]]
      }, {
        validator: ValidationService.passwordMatch
      });
  }

  ngOnInit() {
    this.tokenService.validateToken().subscribe(
      res => {
        this.userData = this.tokenService.currentUserData;
        this.createForm();
      },
      err => console.log(err));
  }


  // Form functions
  createForm() {
    this.accountFormBasic = this.fb.group({
        name: [this.userData.name],
        email: [this.userData.email, [ValidationService.emailRequired, ValidationService.emailValidator]]
      }, {});

      this.accountFormPassword = this.fb.group({
        name: [this.userData.name],
        email: [this.userData.email, [ValidationService.emailRequired, ValidationService.emailValidator]],
        password: ['', [ValidationService.passwordRequired, ValidationService.passwordValidator]],
        passwordConfirmation: ['', [ValidationService.passwordRequired, ValidationService.passwordValidator]]
      }, {
        validator: ValidationService.passwordMatch
      });
  }
  updateForm() {
    if(this.formBasicSet) {
      this.accountFormPassword.controls.name = this.accountFormBasic.controls.name;
      this.accountFormPassword.controls.email = this.accountFormBasic.controls.email;
    } else {
      this.accountFormBasic.controls.name = this.accountFormPassword.controls.name;
      this.accountFormBasic.controls.email = this.accountFormPassword.controls.email;
    }
  }


  // General Functions
  updatingUserAccount() {
    setTimeout(() => {
      this.resetString = "<p class='alert alert-info mt-4' role='alert'>User account data updating...</p>";
    });
  }
  updatingUserDataReset() {
    setTimeout(() => {
      this.updatingData = false;
      this.resetString = "";
    });
  }
  resetSubmit() {
    setTimeout(() => {
      this.resetString = "<p class='alert alert-success mt-4' role='alert'>Account updated successfully. Redirecting now.</p>";
    });
  }
  redirectToPrevious() {
    setTimeout(() => {
      this.authService.redirectToPrevious();
    },1000);
  }


  // Account functions
  submit(value: any) {
    this.updatingData = true;
    this.authService.updateUserData(value)
    .subscribe(
      res => {
        if (value.name != this.tokenService.currentUserData.name) {
          this.tokenService.currentUserData.name = value.name;
        }
        if (value.email != this.tokenService.currentUserData.email) {
          this.tokenService.currentUserData.email = value.email;
        }
        if(!this.formBasicSet) {
          this.authService.updatePassword(value)
          .subscribe(
            res => console.log(res),
            err => this.afterFailedUpdate()
          );
        }
        this.userData = this.tokenService.currentUserData;
        this.userType = this.tokenService.currentUserType;
        this.getUpdateCommentUser();
        this.getUpdateTestimonialUser();
        this.redirectToPrevious();
        this.updatingData = false;
        this.submitted = true;
      },

      err => this.afterFailedUpdate()
    );
  }
  afterFailedUpdate() {
    if(this.formBasicSet) {
      this.accountFormBasic.controls.email.setErrors({'notUnique': true});
      this.accountFormBasic.setErrors(this.accountFormBasic.controls.email.errors);
    } else {
      this.accountFormPassword.controls.email.setErrors({'notUnique': true});
      this.accountFormPassword.setErrors(this.accountFormPassword.controls.email.errors);
    }
    this.updatingData = false;
  }
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  logOut() {
    this.authService.logOut()
    .subscribe(
      res => this.authService.redirectToPrevious(),
      error => {
        console.log("Error logging out: " + error);
        return Observable.throw(error);
      }
    );
  }


  // Delete account functions
  deleteAccount() {
    this.deleteConfirm = false;
    this.deletingData = true;
    this.userData = this.tokenService.currentUserData;
    this.userType = this.tokenService.currentUserType;
    if(this.userType === 'ADMIN')
      return true;
    this.getDeleteCommentUser();
    this.getDeleteTestimonialUser();
    this.deleteAccountData();
  }
  deleteAccountData() {
    this.authService.deleteAccount()
    .subscribe(
      res => {
        this.redirectToPrevious();
        this.deletingData = false;
        this.deleteConfirmed = true;
      },
      err => {
        console.log("Error deleting account");
        this.deletingData = false;
        this.deleteConfirm = false;
        this.deletionError = true;
        return Observable.throw(err);
      }
    );
  }
  deletingDataMsg() {
    setTimeout(() => {
      this.deletionString = "<p class='alert alert-info mt-4' role='alert'>User account data getting deleted...</p>";
    });
  }
  deleteConfirmedMsg() {
    setTimeout(() => {
      this.deletionString = "<p class='alert alert-success mt-4' role='alert'>User account deleted successfully. Redirecting now.</p>";
    });
  }
  deletionErrorMsg() {
    setTimeout(() => {
      this.deletionString = "<p class='alert alert-warning mt-4' role='alert'>User account was not able to be deleted due to a network error. Please contact your network administrator.</p>";
    });
  }


  // CommentUser functions
  updateCommentUser() {
    if(this.commentUsers) {
      if(this.findCommentUserId(this.userData.id, this.userType))
      {
        let commentUser:CommentUser;
        this.commentUser.id = this.findCommentUserId(this.userData.id, this.userType);
        this.commentUser.user_id = this.userData.id;
        this.commentUser.user_type = this.userType;
        this.commentUser.user_name = this.userData.name;
        this.articleService.updateCommentUser(this.commentUser)
        .subscribe(
          res => console.log('Comment User updated successfully'),
          err => {
            console.log(err);
            return Observable.throw(err);
          }
        );
      }
    }
  }
  deleteCommentUser() {
    if(this.commentUsers) {
      if(this.findCommentUserId(this.userData.id, this.userType))
      {
        let commentUser:CommentUser;
        this.commentUser.id = this.findCommentUserId(this.userData.id, this.userType);
        this.commentUser.user_id = this.userData.id;
        this.commentUser.user_type = this.userType;
        this.commentUser.user_name = this.userData.name;
        this.articleService.deleteCommentUser(this.commentUser.id).subscribe(
          res => console.log('Comment User deleted successfully'),
          err => {
            console.log(err);
            return Observable.throw(err);
          }
        );
      }
    }
  }
  findCommentUserId(user_id:number, user_type:string):number {
    for(let commentUser of this.commentUsers) {
      if((commentUser.user_id === user_id) && (commentUser.user_type === user_type))
        return commentUser.id;
    }
  }
  getUpdateCommentUser() {
    this.articleService.getCommentUsers()
    .subscribe(
      commentUsers => {
        this.commentUsers = commentUsers;

        if(this.commentUsers)
          this.updateCommentUser();
      },
      err => console.log(err)
    );
  }
  getDeleteCommentUser() {
    this.articleService.getCommentUsers()
    .subscribe(
      commentUsers =>
      {
        this.commentUsers = commentUsers;
        if(this.commentUsers)
          this.deleteCommentUser();
      },
      err => console.log(err)
    );
  }


  // TestimonialUser functions
  updateTestimonialUser() {
    if(this.testimonialUsers) {
      if(this.findTestimonialUserId(this.userData.id, this.userType))
      {
        let testimonialUser:TestimonialUser;
        this.testimonialUser.id = this.findTestimonialUserId(this.userData.id, this.userType);
        this.testimonialUser.user_id = this.userData.id;
        this.testimonialUser.user_type = this.userType;
        this.testimonialUser.user_name = this.userData.name;
        this.testimonialService.updateTestimonialUser(this.testimonialUser)
        .subscribe(
          res => console.log('Testimonial User updated successfully'),
          err => {
            console.log(err);
            return Observable.throw(err);
          }
        );
      }
    }
  }
  deleteTestimonialUser() {
    if(this.testimonialUsers) {
      if(this.findTestimonialUserId(this.userData.id, this.userType))
      {
        let testimonialUser:TestimonialUser;
        this.testimonialUser.id = this.findTestimonialUserId(this.userData.id, this.userType);
        this.testimonialUser.user_id = this.userData.id;
        this.testimonialUser.user_type = this.userType;
        this.testimonialUser.user_name = this.userData.name;
        this.testimonialService.deleteTestimonialUser(this.testimonialUser.id).subscribe(
          res =>
            console.log('Testimonial User deleted successfully'),
          err => {
            console.log(err);
            return Observable.throw(err);
          }
        );
      }
    }
  }
  findTestimonialUserId(user_id:number, user_type:string):number {
    for(let testimonialUser of this.testimonialUsers) {
      if((testimonialUser.user_id === user_id) && (testimonialUser.user_type === user_type))
        return testimonialUser.id;
    }
  }
  getUpdateTestimonialUser() {
    this.testimonialService.getTestimonialUsers()
    .subscribe(
      testimonialUsers => {
        this.testimonialUsers = testimonialUsers;

        if(this.testimonialUsers)
          this.updateTestimonialUser();
      },
      err => console.log(err)
    );
  }
  getDeleteTestimonialUser() {
    this.testimonialService.getTestimonialUsers()
    .subscribe(
      testimonialUsers =>
      {
        this.testimonialUsers = testimonialUsers;
        if(this.testimonialUsers)
          this.deleteTestimonialUser();
      },
      err => console.log(err)
    );
  }
}