import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../authentication.service';
import { ResetPasswordData } from 'angular2-token';

@Component({
    selector: 'forgot-password',
    templateUrl: './forgot-password.component.html',
})

export class ForgotPasswordComponent {

    resetPasswordData: ResetPasswordData = <ResetPasswordData>{};

    constructor(private tokenService: AuthenticationService) { }

    onSubmit() {
      this.tokenService.resetPassword(this.resetPasswordData).subscribe(
        res =>      console.log(res),
        error =>    console.log(error)
      );
    }
}