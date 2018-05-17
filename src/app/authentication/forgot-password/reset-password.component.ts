import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidationService } from '../validation.service';
import { UpdatePasswordData } from 'angular2-token';
import { AuthenticationService } from '../authentication.service';


@Component({
  templateUrl: 'reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  updatePasswordData: UpdatePasswordData = <UpdatePasswordData>{};
  submitted: boolean = false;
  resetPasswordForm: FormGroup;
  resetString: string;
  resetPasswordToken;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    fb: FormBuilder
  ) {
      this.resetPasswordForm = fb.group({
        password: ['', [ValidationService.passwordRequired, ValidationService.passwordValidator]],
        passwordConfirmation: ['', [ValidationService.passwordRequired, ValidationService.passwordValidator]]
      }, {
        validator: ValidationService.passwordMatch
      });
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.resetPasswordToken = params['token'];
    }, () => {
      console.log('Error with token.');
    });
  }


  submit(value: any) {
    this.updatePasswordData.password = value.password;
    this.updatePasswordData.passwordConfirmation = value.passwordConfirmation;
    this.updatePasswordData.passwordCurrent = null;
    this.updatePasswordData.resetPasswordToken = this.resetPasswordToken;

    this.authService.updatePassword(this.updatePasswordData).subscribe(
      res => {
        setTimeout(() => {
          this.authService.redirectToPrevious();
        },1000);

        this.submitted = true;
      },
      err => this.afterFailedUpdate(err)
    );
  }
  afterFailedUpdate(errors: any) {
    let parsed_errors = JSON.parse(errors._body).errors;

    for(let attribute in this.resetPasswordForm.controls) {
      if (parsed_errors[attribute]) {
        this.resetPasswordForm.controls[attribute]
            .setErrors(parsed_errors[attribute]);
      }
    }
    this.resetPasswordForm.setErrors(parsed_errors);

    this.submitted = false;
  }
  resetSubmit() {
    setTimeout(() => {
      this.resetString = "<p class='alert alert-success mt-4' role='alert'>User password updated successfully. Redirecting now...</p>";
    });
  }
}
