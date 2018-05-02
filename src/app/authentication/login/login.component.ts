import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidationService } from '../validation.service';
import { AuthenticationService } from '../authentication.service';


@Component({
  templateUrl: './login.component.html'
})

export class LoginComponent {
  submitted: boolean = false;
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
    this.authService.logIn(value.email, value.password).subscribe(
        res => {
          setTimeout(() => {
            this.authService.redirectAfterLogin();
          },1000);

          this.submitted = true;
        },
        err => this.afterFailedUserLogin(value)
      );
  }

  afterFailedUserLogin(value: any) {
    this.authService.logInAdmin(value.email, value.password).subscribe(
        res => {
          setTimeout(() => {
            this.authService.redirectAfterLogin();
          },1000);

          this.submitted = true;
        },
        err => this.afterFailedAdminLogin(err)
      );
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

    this.submitted = false;
  }

  resetSubmit() {
    setTimeout(() => {
      this.resetString = "<p class='alert alert-success mt-4' role='alert'>User account logged in successfully. Redirecting to homepage.</p>";
    });
  }
}