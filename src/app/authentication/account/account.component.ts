import { Component, OnInit } from '@angular/core';
import { Angular2TokenService, UserData } from 'angular2-token';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidationService } from '../validation.service';
import { AuthenticationService } from '../authentication.service';
import { Observable } from 'rxjs/Observable';


@Component({
  templateUrl: './account.component.html',
})

export class AccountComponent implements OnInit {
  userData: UserData = <UserData>{};
  submitted: boolean = false;
  accountFormBasic: FormGroup;
  accountFormPassword: FormGroup;
  resetString: string;
  formBasicSet: boolean = true;

  constructor(
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

  submit(value: any) {
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
            res => {
              setTimeout(() => {
                this.authService.redirectAfterLogin();
              },1000);
            },
            err => this.afterFailedUpdate()
          );
        }

        setTimeout(() => {
          this.authService.redirectAfterLogin();
        },1000);

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
    this.submitted = false;
  }

  resetSubmit() {
    setTimeout(() => {
      this.resetString = "<p class='alert alert-success mt-4' role='alert'>Account updated successfully.</p>";
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logOut() {
    this.authService.logOut()
    .subscribe(
      res => this.authService.redirectAfterLogin(),
      err => {
        console.log("Error logging out");
        return Observable.throw(err);
      }
    );
  }

  cancelAccount() {
    this.authService.deleteAccount()
    .subscribe(
      res => this.authService.redirectAfterLogin(),
      err => {
        console.log("Error deleting account");
        return Observable.throw(err);
      }
    );
  }
}