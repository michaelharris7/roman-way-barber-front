import { OnInit, Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { Angular2TokenService, Angular2TokenOptions, SignInData, UserData, AuthData, UpdatePasswordData } from 'angular2-token';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/filter';

@Injectable()
export class AuthenticationService {
  redirectUrl: string;
  signInData: SignInData = <SignInData>{};
  userData: UserData = <UserData>{};
  authData: AuthData = <AuthData>{};
  updatePasswordData: UpdatePasswordData = <UpdatePasswordData>{};
  atOptions: Angular2TokenOptions;
  previousUrl: string;
  usersApiBase = environment.USERS_API_BASE;

  constructor(
    private http: Http,
    private router: Router,
    private tokenService: Angular2TokenService,
  ) {

    this.router.events
      .filter(e => e instanceof NavigationStart )
      .pairwise()
      .subscribe(e => {
        this.previousUrl = e[0]['url'];
      });

    this.tokenService.init({
      apiBase:                    this.usersApiBase,
      apiPath:                    null,

      signInPath:                 'sign_in',
      signInRedirect:             'login',
      signInStoredUrlStorageKey:  'redirectTo',

      signOutPath:                'sign_out',
      validateTokenPath:          'validate_token',
      signOutFailedValidate:      true,

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


  // Logging Functions
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
  isLoggedIn(): boolean {
    return this.tokenService.userSignedIn();
  }
  logOut(): Observable<Response> {
    return this.tokenService.signOut()
  }


  // Account Management Functions
  registerAccount(name, email, password): Observable<Response> {
    return this.tokenService.registerAccount({
      name: name,
      email: email,
      password: password,
      passwordConfirmation: password,
      userType: 'USER'
    });
  }
  deleteAccount(): Observable<Response> {
    return this.tokenService.deleteAccount();
  }
  resetPassword(email): Observable<Response> {
    return this.tokenService.resetPassword({
      email: email,
      userType: 'USER'
    });
  }
  updatePassword(data): Observable<Response> {
    return this.tokenService.updatePassword({
      password:             data.password,
      passwordConfirmation: data.password
    })
  }
  updateUserData(data): Observable<Response> {
    let body = JSON.stringify(data);
    let userType = this.tokenService.currentUserType;

    if(userType === 'ADMIN') {
      return this.tokenService.put('admin_auth', body);
    } else {
      return this.tokenService.put('auth', body);
    }
  }


  // Redirection
  redirectToPrevious(): void {
    if(!this.previousUrl) {
      this.previousUrl = '/';
    }
    this.router.navigate([this.previousUrl]);
  }


  // General data extraction
  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }
  private handleError (error: any): Promise<any> {
    console.error('An error occured ', error);
    return Promise.reject(error.message || error);
  }
}