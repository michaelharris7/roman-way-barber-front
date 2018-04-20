import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ValidationService } from '../validation.service';
import { ControlMessagesComponenet } from '../control-messages.component'
import { AuthenticationService } from '../authentication.service';
import { SignInData } from 'angular2-token';


@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})


export class LoginComponent implements OnInit {
  user: SignInData = <SignInData>{};
  submitted: boolean;
  failedLogin: boolean;
  loginReset: boolean;
  loginForm: FormGroup;

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

  ngOnInit() {
    this.submitted = false;
    this.failedLogin = false;
    this.loginReset = false;
    // this.loginForm = this.formBuilder.group({
    //   email: ['', [ValidationService.emailRequired, ValidationService.emailValidator]],
    //   password: ['', [ValidationService.passwordRequired, ValidationService.passwordValidator]],
    //   passwordConfirmation: ['', [ValidationService.passwordRequired, ValidationService.passwordValidator, ValidationService.passwordMatch]]
    // });
  }

  // , ValidationService.passwordMatchValidator


  submit(value: any) {
    this.submitted = true;
    this.authService.logIn(value.email, value.password).subscribe(
      this.authService.redirectAfterLogin.bind(this.authService),
      this.afterFailedLogin.bind(this));
  }
  afterFailedLogin(errors: any) {
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
}