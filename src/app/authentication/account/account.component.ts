import { Component } from '@angular/core';
import { Angular2TokenService, UserData, AuthData } from 'angular2-token';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ValidationService } from '../validation.service';
import { AuthenticationService } from '../authentication.service';


@Component({
  templateUrl: './account.component.html',
})


export class AccountComponent {
  userData: UserData = <UserData>{};
  authData: AuthData = <AuthData>{};
  formReset: boolean = false;
  submitted: boolean = false;
  failedAccount: boolean = false;
  accountReset: boolean = false;
  accountFormBasic: FormGroup;
  accountFormPassword: FormGroup;
  // accountForm: FormGroup;
  resetString: string;
  error: string;
  formData: string = '';
  formBasicSet: boolean = true;

  constructor(
    private tokenService: Angular2TokenService,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    fb: FormBuilder
  ) {
      this.userData = this.tokenService.currentUserData;
      this.authData = this.tokenService.currentAuthData;

      this.accountFormBasic = fb.group({
        name: [this.userData.name],
        email: [this.userData.email, [ValidationService.emailRequired, ValidationService.emailValidator]],
        passwordCurrent: ['', [ValidationService.passwordRequired, ValidationService.passwordValidator]]
      }, {});

      this.accountFormPassword = fb.group({
        name: [this.userData.name],
        email: [this.userData.email, [ValidationService.emailRequired, ValidationService.emailValidator]],
        passwordCurrent: ['', [ValidationService.passwordRequired, ValidationService.passwordValidator]],
        password: ['', [ValidationService.passwordRequired, ValidationService.passwordValidator]],
        passwordConfirmation: ['', [ValidationService.passwordRequired, ValidationService.passwordValidator]]
      }, {
        validator: ValidationService.passwordMatch
      });
  }

  submit(value: any) {
    this.submitted = true;
    // if(this.accountForm.controls.password.value === '' && this.accountForm.controls.passwordConfirmation.value === '') {
    //   this.accountFormBasic.controls.name = this.accountForm.controls.name;
    //   this.accountFormBasic.controls.email = this.accountForm.controls.email;
    //   this.accountFormBasic.controls.passwordCurrent = this.accountForm.controls.passwordCurrent;
    //   setTimeout(() => {
    //     this.formBasicSet = true;
    //     console.log('success 1');
    //     if(this.formBasicSet == true) {
    //       setTimeout(() => {
    //         this.accountForm = this.accountFormBasic;
    //         // this.accountForm.controls.password;
    //         // this.accountForm.controls.passwordConfirmation;
    //         this.accountForm.removeControl("password");
    //         this.accountForm.removeControl("passwordConfirmation");
    //         console.log('success 2');
    //         if(this.accountForm == this.accountFormBasic && !this.accountForm.contains('passwordConfirmation')) {
    //           setTimeout(() => {
    //             this.saveUserData(value);
    //             console.log('success 3');
    //           }, 500);
    //         }
    //       }, 500);
    //     }
    //   }, 500);
    // } else {
      this.saveUserData(value);
      console.log('success 4');
    // }


    // this.authService.resetPassword(value).subscribe(
    //   this.authService.redirectAfterLogin.bind(this.authService),
    //   this.afterFailedReset.bind(this)
    // );
  }

  // updateCurrentData(name, email) {
  //   this.userData = name
  // }

// formChange(value: any) {
//   if(this.accountForm !== this.accountFormPassword) {
//     this.accountFormPassword.controls.name = this.accountForm.controls.name;
//     this.accountFormPassword.controls.email = this.accountForm.controls.email;
//     this.accountFormPassword.controls.passwordCurrent = this.accountForm.controls.passwordCurrent;
//     this.accountFormPassword.controls.password = this.accountForm.controls.password;
//     this.accountFormPassword.controls.passwordConfirmation = this.accountForm.controls.passwordConfirmation;
//     setTimeout(() => {
//       this.accountForm = this.accountFormPassword;
//       setTimeout(() => {
//         this.accountForm.updateValueAndValidity();
//         this.formReset = true;
//         console.log(1);
//         // this.accountForm.markAsUntouched();
//       });
//     });
//   } else if(value.controls.password.value == '') {
//     setTimeout(() => {
//       this.accountFormNoPassword.controls.name = this.accountForm.controls.name;
//       this.accountFormNoPassword.controls.email = this.accountForm.controls.email;
//       this.accountFormNoPassword.controls.passwordCurrent = this.accountForm.controls.passwordCurrent;
//       this.accountFormNoPassword.controls.password = this.accountForm.controls.password;
//       this.accountFormNoPassword.controls.passwordConfirmation = this.accountForm.controls.passwordConfirmation;
//       this.accountForm = this.accountFormNoPassword;
//       this.accountForm.updateValueAndValidity();
//       this.formReset = true;
//       console.log(2);
//       // this.accountForm.markAsUntouched();
//     });
//   }
// }

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
  this.authService.updateUserData(value)
    .subscribe(
      data => {
        this.error = '';
        // if (!value.password) {
        //   value.password = this.tokenService.UpdatePasswordData.password;
        // }
        if (value.name != this.tokenService.currentUserData.name) {
          this.tokenService.currentUserData.name = value.name;
          this.tokenService.currentUserData.uid = value.name;
          this.tokenService.currentAuthData.uid = value.name;
          localStorage.setItem('uid', value.name);
        }
        if (value.email != this.tokenService.currentUserData.email) {
          this.tokenService.currentUserData.email = value.email;
          this.tokenService.currentUserData.uid = value.email;
          this.tokenService.currentAuthData.uid = value.email;
          localStorage.setItem('uid', value.email);
        }
      },
      error => {
        console.log('Error saving user ' + error);
      }
    );
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
    }, 100);
  }
}