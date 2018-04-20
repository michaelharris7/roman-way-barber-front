import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

// import { RegisterComponent } from './register/register.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    ForgotPasswordComponent
    // RegisterComponent
  ],
  providers: [
  ]
})
export class AuthenticationModule {}