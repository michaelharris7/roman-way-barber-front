import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../validation.service';
import { ControlMessagesComponenet } from './control-messages.component'
import { SignInData } from 'angular2-token';
import { AuthenticationService } from '../authentication.service';


@Component({
  selector: 'login-test',
  // templateUrl: './login-test.component.html'
  templateUrl: 'login-test.component.html'

  // `
  // <!--
  //   <form [formGroup]="userForm" (submit)="saveUser()">
  //     <label for="name">Name</label>
  //     <input formControlName="name" id="name" #name="ngControl" />
  //     <div [hidden]="name.valid">Required</div>

  //     <label for="email">Email</label>
  //     <input formControlName="email" id="email" #email="ngControl" />
  //     <div [hidden]="email.valid">Invalid</div>

  //     <label for="profile">Profile Description</label>
  //     <input formControlName="email" id="profile" #profile="ngControl" />
  //     <div [hidden]="profile.valid">Invalid</div>

  //     <button type="submit" [disabled]="!userForm.valid">Submit</button>
  //   </form>
  // -->

  // <form [formGroup]="userForm" (submit)="saveUser()" style="width:600px">
  //   <div>
  //     <label for="name">Name</label>
  //     <input formControlName="name" id="name" />
  //   </div>
  //   <control-messages [control]="userForm.controls.name"></control-messages>

  //   <div>
  //     <label for="email">Email</label>
  //     <input formControlName="email" id="email" />
  //   </div>
  //   <control-messages [control]="userForm.controls.email"></control-messages>

  //   <div>
  //     <label for="profile">Profile Description</label>
  //     <textarea formControlName="profile" id="profile"></textarea>
  //   </div>
  //   <control-messages [control]="userForm.controls.profile"></control-messages>

  //   <button type="submit" [disabled]="!userForm.valid">Submit</button>
  // </form>
  // `
})

export class LoginTestComponent implements OnInit {
  user: SignInData = <SignInData>{};
  submitted: boolean;
  failedLogin: boolean;
  loginForm: FormGroup;
// export class LoginTestComponent {
//   submitted: boolean = false;
//   failedLogin: boolean = false;
//   loginForm: any;

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit() {
    this.submitted = false;
    this.failedLogin = false;
    this.loginForm = this.formBuilder.group({
      'email': ['', [ValidationService.emailRequired, ValidationService.emailValidator]],
      'password': ['', [ValidationService.passwordRequired, ValidationService.passwordValidator]],
      'passwordConfirmation': ['', [ValidationService.passwordRequired, ValidationService.passwordValidator, ValidationService]]
    });
  }

  // saveUser() {
  //   if (this.loginForm.dirty && this.loginForm.valid) {
  //     alert(`Name: ${this.loginForm.value.email} Email: ${this.loginForm.value.password}`);
  //     this.submitted = true;
  //   }
  //   if (!this.loginForm.valid) {
  //     this.failedLogin = true;
  //     this.submitted = false;
  //     return;
  //   }
  // }



  // submit(value: any) {
  //   this.submitted = true;
  //   // this.authService.logIn(value.email, value.password).subscribe(
  //   // this.authService.logIn(value).subscribe(
  //   this.authService.logIn(value.email, value.password).subscribe(
  //     this.authService.redirectAfterLogin.bind(this.authService),
  //     this.afterFailedLogin.bind(this)
  //   );

  //   if (!this.loginForm.valid) {
  //     this.failedLogin = true;
  //     this.submitted = false;
  //     return;
  //   }
  // }



  submit(value: any) {
    this.submitted = true;
    this.failedLogin = false;
    // this.authService.logIn(value.email, value.password).subscribe(
    //     res =>      console.log(res),
    //     error =>    console.log(error)
    // );
    // this.authService.logIn(value.email, value.password).subscribe(
    //   this.authService.redirectAfterLogin.bind(this.authService),
    //   this.afterFailedLogin.bind(this)
    // );
    this.authService.logIn(value.email, value.password).subscribe(this.authService.redirectAfterLogin.bind(this.authService),this.afterFailedLogin.bind(this));
  }

    // if (!this.loginForm.valid) {
    //   this.failedLogin = true;
    //   this.submitted = false;
    //   return;
    // }

  afterFailedLogin(errors: any) {
    let parsed_errors = JSON.parse(errors._body).errors;
    // this.failedLogin = true;
    // this.submitted = false;
    console.log(parsed_errors);
    this.failedLogin = true;
    this.submitted = false;
  //   this.failedLogin = true;
  //   this.submitted = false;
    // console.log(parsed_errors);
  //   for(let attribute in this.loginForm.controls) {
  //     if (parsed_errors[attribute]) {
  //       this.loginForm.controls[attribute]
  //           .setErrors(parsed_errors[attribute]);
  //     }
  }
  //   this.loginForm.setErrors(parsed_errors);
}