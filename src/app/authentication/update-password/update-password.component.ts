import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidationService } from '../validation.service';
import { AuthenticationService } from '../authentication.service';


@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
})


export class ForgotPasswordComponent {
  submitted: boolean = false;
  failedForgotPassword: boolean = false;
  forgotPasswordReset: boolean = false;
  forgotPasswordForm: FormGroup;
  resetString: string;

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    fb: FormBuilder
  ) {
      this.forgotPasswordForm = fb.group({
        email: ['', [ValidationService.emailRequired, ValidationService.emailValidator]],
        password: ['', [ValidationService.passwordRequired, ValidationService.passwordValidator]],
        passwordConfirmation: ['', [ValidationService.passwordRequired, ValidationService.passwordValidator]]
      }, {
        validator: ValidationService.passwordMatch
      })
  }

  submit(value: any) {
    this.submitted = true;
    this.authService.resetPassword(value).subscribe(
      this.authService.redirectAfterLogin.bind(this.authService),
      this.afterFailedReset.bind(this)
    );
  }

  afterFailedReset(errors: any) {
    let parsed_errors = JSON.parse(errors._body).errors;

    this.failedForgotPassword = true;
    this.submitted = false;
    this.forgotPasswordForm.markAsUntouched();

    for(let attribute in this.forgotPasswordForm.controls) {
      if (parsed_errors[attribute]) {
        this.forgotPasswordForm.controls[attribute]
            .setErrors(parsed_errors[attribute]);
      }
    }
    this.forgotPasswordForm.setErrors(parsed_errors);
  }

  resetTouch() {
    setTimeout(() => {
      this.forgotPasswordForm.markAsUntouched();
      this.forgotPasswordReset = true;
    });
  }
  resetFailedForgotPassword() {
    setTimeout(() => {
      this.failedForgotPassword = false;
      this.forgotPasswordReset = false;
    });
  }
  resetSubmit() {
    setTimeout(() => {
      this.resetString = "<p class='alert alert-success mt-4' role='alert'>Password reset successfully. Redirecting to homepage.</p>";
    }, 100);
  }
}