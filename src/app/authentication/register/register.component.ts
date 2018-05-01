import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { ValidationService } from '../validation.service';


@Component({
  templateUrl: './register.component.html'
})

export class RegisterComponent {
  submitted: boolean = false;
  registerForm: FormGroup;
  resetString: string;

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    fb: FormBuilder
  ) {
      this.registerForm = fb.group({
        name: [''],
        email: ['', [ValidationService.emailRequired, ValidationService.emailValidator]],
        password: ['', [ValidationService.passwordRequired, ValidationService.passwordValidator]],
        passwordConfirmation: ['', [ValidationService.passwordRequired, ValidationService.passwordValidator]]
      }, {
        validator: ValidationService.passwordMatch
      })
  }

  submit(value: any) {
    this.submitted = true;
    if(!value.name) {
      value.name = 'Anonymous';
    }
    this.authService.registerAccount(value.name, value.email, value.password).subscribe(
      res => {
        this.authService.logIn(value.email, value.password);
        setTimeout(() => {
          this.authService.redirectAfterLogin();
        },1000);
      },
      err => this.afterFailedRegister(err)
    );
  }

  afterFailedRegister(errors: any) {
    let parsed_errors = JSON.parse(errors._body).errors;
    this.submitted = false;

    for(let attribute in this.registerForm.controls) {
      if (parsed_errors[attribute]) {
        this.registerForm.controls[attribute]
            .setErrors(parsed_errors[attribute]);
      }
    }
    this.registerForm.setErrors(parsed_errors);
  }

  resetSubmit() {
    setTimeout(() => {
      this.resetString = "<p class='alert alert-success mt-4' role='alert'>User account created successfully. Redirecting to homepage.</p>";
    });
  }
}