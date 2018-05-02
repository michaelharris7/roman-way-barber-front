import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AccountComponent } from './account/account.component';
import { ControlMessagesComponenet } from './control-messages.component';

import { ValidationService } from './validation.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ],
  declarations: [
    RegisterComponent,
    LoginComponent,
    ForgotPasswordComponent,
    AccountComponent,
    ControlMessagesComponenet
  ],
  providers: [
    ValidationService
  ]
})

export class AuthenticationModule {}