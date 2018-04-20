import { OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Angular2TokenService } from 'angular2-token';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class AuthenticationService implements OnInit{
  redirectUrl: string;

  constructor(
    private http: Http,
    private router: Router,
    private tokenService: Angular2TokenService
  ) {
    this.tokenService.init({
      apiBase:                    'http://localhost:3000',
      apiPath:                    null,

      signInPath:                 'sign_in',
      signInRedirect:             null,
      signInStoredUrlStorageKey:  null,

      signOutPath:                'sign_out',
      validateTokenPath:          'validate_token',
      signOutFailedValidate:      false,

      registerAccountPath:        '',
      deleteAccountPath:          '',
      registerAccountCallback:    window.location.href,

      updatePasswordPath:         '',
      resetPasswordPath:          'password',
      resetPasswordCallback:      window.location.href,

      oAuthBase:                  window.location.origin,
      oAuthPaths: {
          github:                 'github'
      },
      oAuthCallbackPath:          'oauth_callback',
      oAuthWindowType:            'newWindow',
      oAuthWindowOptions:         null,

      userTypes: [
        { name: 'ADMIN', path: 'admin_auth' },
        { name: 'USER', path: 'auth' }
      ],

      globalOptions: {
          headers: {
              'Content-Type':     'application/json',
              'Accept':           'application/json'
          }
      },
    });
  }

  ngOnInit() {
  }

  // logIn(email: string, password: string): Observable<Response> {
  // logIn(userData): Observable<Response> {
  logIn(email, password): Observable<Response> {
    // return this.tokenService.signIn(userData);

    return this.tokenService.signIn({
      email: email,
      password: password,
      userType: 'USER'
    });
  }

  registerAccount(registerAccount): Observable<Response> {
    return this.tokenService.registerAccount({
      email: registerAccount.email,
      password: registerAccount.password,
      passwordConfirmation: registerAccount.password,
      userType: 'USER'
    });
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

  // findProfile() {
  //   return this.http.get('/api/user/profile.json');
  // }
}