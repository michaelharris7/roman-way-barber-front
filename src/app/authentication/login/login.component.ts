import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidationService } from '../validation.service';
import { AuthenticationService } from '../authentication.service';


@Component({
  templateUrl: './login.component.html'
})


export class LoginComponent {
  submitted: boolean = false;
  failedLogin: boolean = false;
  loginReset: boolean = false;
  loginForm: FormGroup;
  resetString: string;

  constructor(
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


  submit(value: any) {
    this.submitted = true;
    this.authService.logIn(value.email, value.password).subscribe(
      res => this.authService.redirectAfterLogin(),
      err => this.afterFailedUserLogin(value),
      () => console.log(value));
  }

  afterFailedUserLogin(value: any) {
    this.authService.logInAdmin(value.email, value.password).subscribe(
      this.authService.redirectAfterLogin.bind(this.authService),
      this.afterFailedAdminLogin.bind(this));
  }

  afterFailedAdminLogin(errors: any) {
    let parsed_errors = JSON.parse(errors._body).errors;

    this.failedLogin = true;
    this.submitted = false;

    for(let attribute in this.loginForm.controls) {
      if (parsed_errors[attribute]) {
        this.loginForm.controls[attribute]
            .setErrors(parsed_errors[attribute]);
      }
    }
    this.loginForm.setErrors(parsed_errors);
  }


  resetTouch() {
    setTimeout(() => {
      this.loginForm.markAsUntouched();
      this.loginReset = true;
    });
  }
  resetFailedLogin() {
    setTimeout(() => {
      this.failedLogin = false;
      this.loginReset = false;
    });
  }
  resetSubmit() {
    setTimeout(() => {
      this.resetString = "<p class='alert alert-success mt-4' role='alert'>User account logged in successfully. Redirecting to homepage.</p>";
    }, 100);
  }
}