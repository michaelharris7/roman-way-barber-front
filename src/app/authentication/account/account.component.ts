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
  alertNumber: number = 0;
  alertMessage: string;
  alertDeleteNumber: number = 0;
  alertDeleteMessage: string;
  accountFormBasic: FormGroup;
  accountFormPassword: FormGroup;
  formBasicSet: boolean = true;
  deleteConfirm: boolean = false;
  deletingData: boolean = false;
  alertValidationNumber: number = 0;
  alertValidationMessage: string;

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
    this.loginVerificationFormCreation();
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


  // Standard Alert functions
  alertReset() {
    setTimeout(() => {
      this.alertMessage = "";
      this.accountFormBasic.markAsPristine();
      this.accountFormPassword.markAsPristine();
    });
    setTimeout(() => {
      this.alertNumber = 0;
    });
  }
  alertRegistering() {
    setTimeout(() => {
      this.alertMessage = "<p class='alert alert-info mt-4' role='alert'>User account data updating...</p>";
      this.accountFormBasic.markAsPristine();
      this.accountFormPassword.markAsPristine();
    });
    setTimeout(() => {
      this.alertNumber = 0;
    });
  }
  alertSubmitted() {
    setTimeout(() => {
      this.alertMessage = "<p class='alert alert-primary mt-4' role='alert'>User account updated successfully. Redirecting now.</p>";
      this.accountFormBasic.markAsPristine();
      this.accountFormPassword.markAsPristine();
    });
    setTimeout(() => {
      this.alertNumber = 0;
    });
  }
  alertNetworkError() {
    setTimeout(() => {
      this.alertMessage = "<p class='alert alert-warning mt-4' role='alert'>The user account was not able to be updated due to a network error. Please contact your network administrator or try again later.</p>";
      this.accountFormBasic.markAsPristine();
      this.accountFormPassword.markAsPristine();
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


  // Validation Alert functions
  alertValidationError() {
    setTimeout(() => {
      this.alertValidationMessage = "<div class='mt-4 text-center' role='alert'><p class='alert alert-danger pt-3'>The logged in user account is invalid or there is a network error.</p><p class='alert alert-warning'>Please contact your network administrator or try again later. Logging out and redirecting now... </p></div>";
    });
  }
  alertDeleteValidationError() {
    setTimeout(() => {
      this.alertValidationMessage = "<div class='mt-4' role='alert'><p class='alert alert-danger pt-3'>Cannot delete account at this time. The logged in user account is invalid or there is a network error.</p><p class='alert alert-warning'>Please contact your network administrator or try again later. Logging out and redirecting now... </p></div>";
    });
  }


  // Deletion Alert functions
  alertDeleteReset() {
    setTimeout(() => {
      this.alertDeleteMessage = "";
      this.deletingData = false;
      this.accountFormBasic.markAsPristine();
      this.accountFormPassword.markAsPristine();
    });
    setTimeout(() => {
      this.alertDeleteNumber = 0;
    });
  }
  alertDeleting() {
    setTimeout(() => {
      this.alertDeleteMessage = "<p class='alert alert-info mt-4' role='alert'>User account data being deleted...</p>";
      this.accountFormBasic.markAsPristine();
      this.accountFormPassword.markAsPristine();
    });
    setTimeout(() => {
      this.alertDeleteNumber = 0;
    });
  }
  alertDeleteSubmitted() {
    setTimeout(() => {
      this.alertDeleteMessage = "<p class='alert alert-primary mt-4' role='alert'>User account deleted successfully. Redirecting now.</p>";
      this.accountFormBasic.markAsPristine();
      this.accountFormPassword.markAsPristine();
    });
    setTimeout(() => {
      this.alertDeleteNumber = 0;
    });
  }
  alertDeleteNetworkError() {
    setTimeout(() => {
      this.alertDeleteMessage = "<p class='alert alert-warning mt-4' role='alert'>The user account was not able to be deleted due to a network error. Please contact your network administrator or try again later.</p>";
      this.accountFormBasic.markAsPristine();
      this.accountFormPassword.markAsPristine();
    });
    setTimeout(() => {
      this.alertDeleteNumber = 0;
    });
  }
  alertDeleteSetToReset() {
    setTimeout(() => {
      this.alertDeleteNumber = 4;
    });
  }


  // General functions
  redirectToPrevious() {
    setTimeout(() => {
      this.authService.redirectToPrevious();
    },1000);
  }
  redirectToPreviousExtended() {
    setTimeout(() => {
      this.authService.redirectToPrevious();
    },5000);
  }


  // Account functions
  submit(value: any) {
    if(!value.name) {
      value.name = 'Anonymous';
    }
    this.alertNumber = 1;
    if (value.name != this.tokenService.currentUserData.name) {
      this.tokenService.currentUserData.name = value.name;
    }
    if (value.email != this.tokenService.currentUserData.email) {
      this.tokenService.currentUserData.email = value.email;
    }
    this.userData = this.tokenService.currentUserData;
    this.userType = this.tokenService.currentUserType;
    this.updateAllData();
  }
  afterFailedUpdate(errors: any) {
    if(errors.status !== 0) {
      if(this.formBasicSet) {
        this.accountFormBasic.controls.email.setErrors({'notUnique': true});
        this.accountFormBasic.setErrors(this.accountFormBasic.controls.email.errors);
      } else {
        this.accountFormPassword.controls.email.setErrors({'notUnique': true});
        this.accountFormPassword.setErrors(this.accountFormPassword.controls.email.errors);
      }
    } else {
      console.log('User account server down. Cannot update user data at this time.');
      this.alertNumber = 3;
    }
  }
  loginVerificationFormCreation() {
    if(this.isLoggedIn()) {
      this.tokenService.validateToken().subscribe(
        res => {
          this.userData = this.tokenService.currentUserData;
          this.userType = this.tokenService.currentUserType;
          this.createForm();
        },
        err => {
          this.alertValidationNumber = 1;
          console.log("Account won't validate. No user logged in. Logging out: " + err);
          this.logOut();
          this.redirectToPreviousExtended();
        }
      );
    }
  }
  loginDeleteVerification() {
    if(this.isLoggedIn()) {
      this.tokenService.validateToken().subscribe(
        res => {
          this.userData = this.tokenService.currentUserData;
          this.userType = this.tokenService.currentUserType;
          this.deleteAccount();
        },
        err => {
          this.alertValidationNumber = 2;
          console.log("Account won't validate. No user logged in. Logging out: " + err);
          this.logOut();
          this.redirectToPreviousExtended();
        }
      );
    }
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


  // Delete Account functions
  deleteAccount() {
    this.alertDeleteNumber = 1;
    this.deletingData = true;
    this.userData = this.tokenService.currentUserData;
    this.userType = this.tokenService.currentUserType;
    if(this.userType === 'ADMIN')
      return true;
    this.getDeleteAllData();
  }
  deleteAccountData() {
    this.authService.deleteAccount()
    .subscribe(
      res => {
        console.log('User account deleted successfully');
        this.alertDeleteNumber = 2;
        this.redirectToPrevious();
      },
      err => {
        console.log('Error deleting account: ' + err);
        this.alertDeleteNumber = 3;
        return Observable.throw(err);
      }
    );
  }


  // CommentUser functions
  updateAllData() {
    this.articleService.getCommentUsers()
    .subscribe(
      commentUsers => {
        console.log('Article server found');
        this.commentUsers = commentUsers;
        if(this.commentUsers) {
          this.updateCommentUser();
        } else {
        console.log('Comment users not found');
        }
      },
      err => {
        console.log('Article server down. Cannot update comment user at this time.');
        this.alertNumber = 3;
      }
    );
  }
  updateCommentUser() {
    if(this.findCommentUserId(this.userData.id, this.userType))
    {
      let commentUser:CommentUser;
      this.commentUser.id = this.findCommentUserId(this.userData.id, this.userType);
      this.commentUser.user_id = this.userData.id;
      this.commentUser.user_type = this.userType;
      this.commentUser.user_name = this.userData.name;
      this.articleService.updateCommentUser(this.commentUser)
      .subscribe(
        res => {
          console.log('Comment user updated successfully');
          this.getUpdateTestimonialUser();
        },
        err => {
          console.log('There was an error updating the comment user: ' + err);
          this.alertNumber = 3;
        }
      );
    }
  }
  findCommentUserId(user_id:number, user_type:string):number {
    for(let commentUser of this.commentUsers) {
      if((commentUser.user_id === user_id) && (commentUser.user_type === user_type)) {
        return commentUser.id;
      }
    }
  }
  getDeleteAllData() {
    this.articleService.getCommentUsers()
    .subscribe(
      commentUsers =>
      {
        console.log('Article server found');
        this.commentUsers = commentUsers;

        if(this.commentUsers)
          this.deleteCommentUser();
      },
      err => {
        console.log('Article server down. Cannot delete comment user at this time.');
        this.alertDeleteNumber = 3;
      }
    );
  }
  deleteCommentUser() {
    if(this.findCommentUserId(this.userData.id, this.userType))
    {
      let commentUser_id = this.findCommentUserId(this.userData.id, this.userType);
      this.articleService.deleteCommentUser(commentUser_id).subscribe(
        res => {
          console.log('Comment user deleted successfully');
          this.getDeleteTestimonialUser();
        },
        err => {
          console.log('There was an error deleting the comment user: ' + err);
          this.alertDeleteNumber = 3;
          return Observable.throw(err);
        }
      );
    } else {
      console.log('Comment user not found. No need to delete. Moving on to testimonial user.');
      this.getDeleteTestimonialUser();
    }
  }


  // TestimonialUser functions
  getUpdateTestimonialUser() {
    this.testimonialService.getTestimonialUsers()
    .subscribe(
      testimonialUsers => {
        console.log('Testimonial server found');
        this.testimonialUsers = testimonialUsers;

        if(this.testimonialUsers)
          this.updateTestimonialUser();
      },
      err => {
        console.log('Testimonial server down. Cannot update testimonial user at this time.');
        this.alertNumber = 3;
      }
    );
  }
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
          res => {
            console.log('Testimonial user updated successfully');

            if(!this.formBasicSet) {
              this.authService.updatePassword(this.accountFormPassword.value).subscribe(
                res => {
                  console.log('User account password updated successfully');
                  this.authService.updateUserData(this.accountFormBasic.value).subscribe(
                    res => {
                      console.log('User account data updated successfully');
                      this.alertNumber = 2;
                      this.redirectToPrevious();
                    },
                    err => this.afterFailedUpdate(err)
                  );
                },
                err => this.afterFailedUpdate(err)
              );
            } else {
              this.authService.updateUserData(this.accountFormBasic.value).subscribe(
                res => {
                  console.log('User account data updated successfully');
                  this.alertNumber = 2;
                  this.redirectToPrevious();
                },
                err => this.afterFailedUpdate(err)
              );
            }
          },
          err => {
              console.log('There was an error updated the testimonial user: ' + err);
              this.alertNumber = 3;
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
  getDeleteTestimonialUser() {
    this.testimonialService.getTestimonialUsers()
    .subscribe(
      testimonialUsers => {
        console.log('Testimonial server found');
        this.testimonialUsers = testimonialUsers;

        if(this.testimonialUsers)
          this.deleteTestimonialUser();
      },
      err => {
        console.log('Testimonial server down. Cannot delete testimonial user at this time. Recreating deleted comment user.');
        this.alertDeleteNumber = 3;

        let commentUser:CommentUser;
        this.commentUser.user_id = this.userData.id;
        this.commentUser.user_type = this.userType;
        this.commentUser.user_name = this.userData.name;
        this.articleService.createCommentUser(this.commentUser).subscribe(
          res => {
            console.log('Comment User created successfully');
          },
          err => {
            console.log('There was an error creating the comment user: ' + err);
            return Observable.throw(err);
          }
        );
      }
    );
  }
  deleteTestimonialUser() {
    if(this.findTestimonialUserId(this.userData.id, this.userType))
    {
      let testimonialUser_id = this.findTestimonialUserId(this.userData.id, this.userType);
      this.testimonialService.deleteTestimonialUser(testimonialUser_id).subscribe(
        res =>  {
          console.log('Testimonial user deleted successfully');
          this.deleteAccountData();
        },
        err => {
          console.log('There was an error deleting the testimonial user: ' + err + 'Recereating deleted comment user.');
          this.alertDeleteNumber = 3;

          let commentUser:CommentUser;
          this.commentUser.user_id = this.userData.id;
          this.commentUser.user_type = this.userType;
          this.commentUser.user_name = this.userData.name;
          this.articleService.createCommentUser(this.commentUser).subscribe(
            res => {
              console.log('Comment user created successfully');
            },
            err => {
              console.log('There was an error creating the comment user: ' + err);
              return Observable.throw(err);
            }
          );
        }
      );
    } else {
      console.log('Testimonial user not found. No need to delete. Moving on to deleting account.');
      this.deleteAccountData();
    }
  }
}