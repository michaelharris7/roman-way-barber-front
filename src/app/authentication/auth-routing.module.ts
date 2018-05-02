import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Angular2TokenService } from 'angular2-token';
import { AuthenticationService } from './authentication.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AccountComponent } from './account/account.component';


const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [Angular2TokenService]
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
  providers: [ AuthenticationService ]
})

export class AuthRoutingModule {}