import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { SignInData } from 'angular2-token';


@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  user: SignInData = <SignInData>{};
  submitted: boolean;
  failedLogin: boolean;
  loginReset: boolean;
  loginForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.submitted = false;
    this.failedLogin = false;
    this.loginReset = false;
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required]
    });
  }

  submit(value: any) {
    this.submitted = true;
    this.authService.logIn(value.email, value.password).subscribe(
      this.authService.redirectAfterLogin.bind(this.authService),
      this.afterFailedLogin.bind(this)
    );
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

  // ngAfterViewInit() {
  //   if (this.failedLogin = true) {
  //     //stuff that doesn't do view changes
  //     setTimeout(this.resetLogin, 1000);
  //   }
  // }

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