import { OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Angular2TokenService, Angular2TokenOptions, UserData, AuthData, UpdatePasswordData } from 'angular2-token';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class AuthenticationService implements OnInit{
  redirectUrl: string;
  userData: UserData = <UserData>{};
  authData: AuthData = <AuthData>{};
  updatePasswordData: UpdatePasswordData = <UpdatePasswordData>{};
  atOptions: Angular2TokenOptions;

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


  logIn(email, password): Observable<Response> {
    return this.tokenService.signIn({
      email: email,
      password: password,
      userType: 'USER'
    });
  }
  logInAdmin(email, password): Observable<Response> {
    return this.tokenService.signIn({
      email: email,
      password: password,
      userType: 'ADMIN'
    });
  }

  registerAccount(name, email, password): Observable<Response> {
    return this.tokenService.registerAccount({
      name: name,
      email: email,
      password: password,
      passwordConfirmation: password,
      userType: 'USER'
    });
  }

  resetPassword(email): Observable<Response> {
    return this.tokenService.resetPassword({
      email: email,
      userType: 'USER'
    });
  }
  updatePassword(newPassword, oldPassword): Observable<Response> {
    return this.tokenService.updatePassword({
      password:             'newPassword',
      passwordConfirmation: 'newPassword',
      passwordCurrent:      'oldPassword',
    });
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

  updateUserData(data): Observable<Response> {
    let body = JSON.stringify(data);
    return this.tokenService.put('auth', body);
  }
}