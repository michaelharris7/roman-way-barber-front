import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { RegisterData } from 'angular2-token';

@Component({
  selector: 'account-register',
  templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit {
  user: RegisterData = <RegisterData>{};
  submitted: boolean;
  registerForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.submitted = false;
  }

  submit(user) {
    this.submitted = true;
    this.authService.registerAccount(user).subscribe(
      this.authService.redirectAfterLogin.bind(this.authService),
      this.afterFailedRegister.bind(this)
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
  }
}