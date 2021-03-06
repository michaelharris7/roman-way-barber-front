import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidationService } from '../validation.service';
import { AuthenticationService } from '../authentication.service';


@Component({
  templateUrl: './forgot-password.component.html',
})

export class ForgotPasswordComponent {
  submitted: boolean = false;
  forgotPasswordForm: FormGroup;
  resetString: string;

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    fb: FormBuilder
  ) {
      this.forgotPasswordForm = fb.group({
        email: ['', [ValidationService.emailRequired, ValidationService.emailValidator]]
      }, {})
  }


  submit(value: any) {
    this.authService.resetPassword(value.email).subscribe(
        res => {
          setTimeout(() => {
            this.authService.redirectToPrevious();
          },1000);

          this.submitted = true;
        },
        err => this.afterFailedReset(err)
      );
  }
  afterFailedReset(errors: any) {
    let parsed_errors = JSON.parse(errors._body).errors;

    for(let attribute in this.forgotPasswordForm.controls) {
      if (parsed_errors[attribute]) {
        this.forgotPasswordForm.controls[attribute]
            .setErrors(parsed_errors[attribute]);
      }
    }
    this.forgotPasswordForm.setErrors(parsed_errors);

    this.submitted = false;
  }
  resetSubmit() {
    setTimeout(() => {
      this.resetString = "<p class='alert alert-success mt-4' role='alert'>Reset password email successfully sent. Redirecting to homepage...</p>";
    });
  }
}