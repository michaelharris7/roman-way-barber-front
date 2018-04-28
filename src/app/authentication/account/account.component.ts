import { Component, OnInit } from '@angular/core';
import { Angular2TokenService, UserData, AuthData } from 'angular2-token';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ValidationService } from '../validation.service';
import { AuthenticationService } from '../authentication.service';
import { Observable } from 'rxjs/Observable';


@Component({
  templateUrl: './account.component.html',
})


export class AccountComponent implements OnInit {
  userData: UserData = <UserData>{};
  authData: AuthData = <AuthData>{};
  formReset: boolean = false;
  submitted: boolean = false;
  failedAccount: boolean = false;
  accountReset: boolean = false;
  accountFormBasic: FormGroup;
  accountFormPassword: FormGroup;
  resetString: string;
  formData: string = '';
  formBasicSet: boolean = true;
  userType: string;

  constructor(
    private tokenService: Angular2TokenService,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private fb: FormBuilder
  ) {
      this.userData.name = '';
      this.userData.email = 'test@test.com';
      this.authData = this.tokenService.currentAuthData;

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
        this.userType = this.tokenService.currentUserType;
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

  submit(value: any) {
    this.submitted = true;
    this.saveUserData(value);




    // this.authService.resetPassword(value).subscribe(
    //   this.authService.redirectAfterLogin.bind(this.authService),
    //   this.afterFailedReset.bind(this)
    // );
  }


formChangeRefresh(value: any) {
  setTimeout(() => {
    value.controls.password.markAsPristine();
    this.formReset = false;
    console.log(3);
    // if(value.controls.password.untouched) {
    //   this.formReset = false;
    //   value.controls.password.markAsUntouched();
    // }
  });
}

saveUserData(value: any) {
  // if(this.formBasicSet) {
    this.authService.updateUserData(value)
      .subscribe(
        data => {
          if (value.name != this.tokenService.currentUserData.name) {
            this.tokenService.currentUserData.name = value.name;
          if (value.email != this.tokenService.currentUserData.email) {
            this.tokenService.currentUserData.email = value.email;
          }
          this.tokenService.currentUserData.uid = value.email;
            this.tokenService.currentAuthData.uid = value.email;
            localStorage.setItem('uid', value.email);
          }
          if(!this.formBasicSet) {
            this.authService.updatePassword(value)
            .subscribe(
                data => {
                  setTimeout(() => {
                      this.authService.redirectAfterLogin();
                    },200);
                },
                error => {
                  this.afterFailedUpdate.bind(this);
                }
              );
           }
          setTimeout(() => {
            this.authService.redirectAfterLogin();
          },200);
        },
        error => {
          this.afterFailedUpdate.bind(this);
        }
      );
  // } else {
    // this.authService.updatePassword(value).subscribe(
    //   data => {
    //     setTimeout(() => {
    //         this.authService.redirectAfterLogin();
    //       },200);
    //   },
    //   error => {
    //     this.afterFailedUpdate.bind(this);
    //   }
    // );
  // }
  // this.authService.updatePassword(value.password, value.passwordCurrent).subscribe(
  //     res =>      this.authService.redirectAfterLogin.bind(this.authService),
  //     error =>    this.afterFailedUpdate.bind(this)
  // );
}

  afterFailedUpdate(errors: any) {
    let parsed_errors = JSON.parse(errors._body).errors;

    this.failedAccount = true;
    this.submitted = false;

    if (this.formBasicSet) {
      this.accountFormBasic.markAsUntouched();

      for(let attribute in this.accountFormBasic.controls) {
        if (parsed_errors[attribute]) {
          this.accountFormBasic.controls[attribute]
              .setErrors(parsed_errors[attribute]);
        }
      }
      this.accountFormBasic.setErrors(parsed_errors);
    } else {
      this.accountFormPassword.markAsUntouched();

      for(let attribute in this.accountFormPassword.controls) {
        if (parsed_errors[attribute]) {
          this.accountFormPassword.controls[attribute]
              .setErrors(parsed_errors[attribute]);
        }
      }
      this.accountFormPassword.setErrors(parsed_errors);
    }
  }

  resetTouch() {
    setTimeout(() => {
      if (this.formBasicSet) {
        this.accountFormBasic.markAsUntouched();
      } else {
        this.accountFormPassword.markAsUntouched();
      }
      this.accountReset = true;
    });
  }
  resetFailedAccount() {
    setTimeout(() => {
      this.failedAccount = false;
      this.accountReset = false;
    });
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
    this.authService.logOut().subscribe(
        data => { this.authService.redirectAfterLogin(); },
        error => {
          this.afterFailedUpdate.bind(this);
          console.log("Error logging out");
          return Observable.throw(error);
        }
      );
  }
  cancelAccount() {
    this.authService.deleteAccount().subscribe(
    res =>      {
      // this.authService.logOut();
      this.authService.redirectAfterLogin();
    },
    error =>    {
      this.afterFailedUpdate.bind(this);
      console.log(error);
      }
    );
  }
}