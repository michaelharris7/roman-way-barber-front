import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { ValidationService } from '../validation.service';
import { ArticleService } from '../../news/article.service';
import { Angular2TokenService, UserData } from 'angular2-token';
import { CommentUser } from '../../news/comment-user';


@Component({
  templateUrl: './register.component.html'
})

export class RegisterComponent {
  userData: UserData = <UserData>{};
  userType: string;
  commentUser: CommentUser = <CommentUser>{};
  commentUsers: CommentUser[];
  submitted: boolean = false;
  registerForm: FormGroup;
  resetString: string;

  constructor(
    private articleService: ArticleService,
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
  submit(value: any) {
    if(!value.name) {
      value.name = 'Anonymous';
    }
    this.authService.registerAccount(value.name, value.email, value.password).subscribe(
      res => {
        this.authService.logIn(value.email, value.password)
        .subscribe(
          res => {
            this.userData = this.tokenService.currentUserData;
            this.userType = this.tokenService.currentUserType;
            this.getCommentUsers();

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

    this.submitted = false;
  }
  resetSubmit() {
    setTimeout(() => {
      this.resetString = "<p class='alert alert-success mt-4' role='alert'>User account created successfully. Redirecting to homepage.</p>";
    });
  }
  redirectAfterLogin() {
    setTimeout(() => {
      this.authService.redirectAfterLogin();
    },1000);
  }


  //CommentUser functions
  createCommentUserIfNull() {
    if(this.commentUsers) {
      if(!this.searchCommentUser(this.userData.id, this.userType)) {
        let commentUser:CommentUser;
        this.commentUser.user_id = this.userData.id;
        this.commentUser.user_type = this.userType;
        this.commentUser.user_name = this.userData.name;
        this.articleService.createCommentUser(this.commentUser).subscribe(
          res => {
            console.log('Comment User created successfully');
            this.articleService.getCommentUsers().subscribe(
              commentUsers => {
                this.commentUsers = commentUsers;
                for(let commentUser of this.commentUsers) {
                  console.log(commentUser);
                }
              },
              err => console.log(err)
            );
          },
          err => console.log(err)
          );
      }
      this.redirectAfterLogin();
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
}