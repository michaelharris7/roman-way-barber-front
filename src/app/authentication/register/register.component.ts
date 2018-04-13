import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../authentication.service';


@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  submitted: boolean;
  registerForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit() {
    this.submitted = false;
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit(value: any) {
    this.submitted = true;
    if (!this.registerForm.valid) { return; }

    this.authService.logIn(value.email, value.password).subscribe(
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