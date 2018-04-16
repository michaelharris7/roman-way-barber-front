import { OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '@angular/http';
import { Angular2TokenService } from 'angular2-token';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class AuthenticationService implements OnInit{
  redirectUrl: string;

  constructor(
    private router: Router,
    private tokenService: Angular2TokenService
  ) {
    this.tokenService.init({
      apiBase:                    null,
      apiPath:                    null,

      signInPath:                 'http://localhost:3001/auth/sign_in',
      signInRedirect:             null,
      signInStoredUrlStorageKey:  null,

      signOutPath:                'http://localhost:3001/auth/sign_out',
      validateTokenPath:          'http://localhost:3001/auth/validate_token',
      signOutFailedValidate:      false,

      registerAccountPath:        'http://localhost:3001/auth/',
      deleteAccountPath:          'http://localhost:3001/auth',
      registerAccountCallback:    window.location.href,

      updatePasswordPath:         'http://localhost:3001/auth',
      resetPasswordPath:          'http://localhost:3001/auth/password',
      resetPasswordCallback:      window.location.href,

      oAuthBase:                  window.location.origin,
      oAuthPaths: {
          github:                 'http://localhost:3001/auth/github'
      },
      oAuthCallbackPath:          'http://localhost:3001/oauth_callback',
      oAuthWindowType:            'http://localhost:3001/newWindow',
      oAuthWindowOptions:         null,

      userTypes:                  null,

      globalOptions: {
          headers: {
              'Content-Type':     'application/json',
              'Accept':           'application/json'
          }
      }
    });
  }

  ngOnInit() {
  }

  logIn(email: string, password: string): Observable<Response> {
    return this.tokenService.signIn({
      email: email,
      password: password
    });
  }

  registerAccount(registerAccount): Observable<Response> {
    return this.tokenService.registerAccount(registerAccount);
    // {
    //   email: user.email,
    //   password: user.password,
    //   passwordConfirmation: user.password
    // });
  }

  resetPassword(resetPassword): Observable<Response> {
    return this.tokenService.resetPassword(resetPassword);
  }

  logOut(): Observable<Response> {
    this.redirectUrl = undefined;
    return this.tokenService.signOut()
  }

  isLoggedIn(): boolean {
    return this.tokenService.userSignedIn();
  }

  redirectAfterLogin(): void {
    let redirectTo = this.redirectUrl ? this.redirectUrl: '/';
    this.redirectUrl = undefined;
    this.router.navigate([redirectTo]);
  }
}