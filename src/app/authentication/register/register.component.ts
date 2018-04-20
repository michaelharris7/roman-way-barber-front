import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { RegisterData } from 'angular2-token';


@Component({
  selector: 'account-register',
  templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit {
  user: RegisterData = <RegisterData>{};
  submitted: boolean;
  failedRegister: boolean;
  registerForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.submitted = false;
    this.failedRegister = false;
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit(value: any) {
    this.submitted = true;
    this.authService.registerAccount(value.email, value.password).subscribe(
      this.authService.redirectAfterLogin.bind(this.authService),
      this.afterFailedRegister.bind(this)
    );

    // if (!this.registerForm.valid) {
    //   this.failedRegister = true;
    //   this.submitted = false;
    //   return;
    // }
  }
      // res => {
      //   this.authService.redirectAfterLogin.bind(this.authService)
        // this.afterFailedRegister.bind(this));
    //   },
    //   error =>    console.log(error)
    // );
  // }

  afterFailedRegister(errors: any) {
    let parsed_errors = JSON.parse(errors._body).errors;

    this.failedRegister = true;
    this.submitted = false;
    this.registerForm.markAsUntouched();

    for(let attribute in this.registerForm.controls) {
      if (parsed_errors[attribute]) {
        this.registerForm.controls[attribute]
            .setErrors(parsed_errors[attribute]);
      }
    }
    this.registerForm.setErrors(parsed_errors);
  }

  // resetRegisterFail() {
  //   // if (this.failedRegister === true && this.registerForm.untouched) {
  //     // this.failedRegister = false;
  //     Promise.resolve(null).then(() => this.failedRegister = false);
  //   // }
  // }

  // ngAfterViewInit() {
  //   if (this.failedRegister) {
  //     setTimeout(() => {
  //       this.registerForm.markAsUntouched();
  //       this.failedRegister = false;
  //     });
  //   }
  ngAfterViewInit(){
    if (this.failedRegister) {
    //stuff that doesn't do view changes
    setTimeout(_=> this.registerForm.markAsUntouched());
    }
  }
    // if (this.registerForm.touched && )
  // }

  // resetRegisterFail() {
  //   if (this.failedRegister) {
  //     this.registerForm.tick_then(() => this.registerForm.markAsUntouched());
  // //     this.registerForm.markAsUntouched();
  // //   }
  // //   if (this.registerForm.touched) {
  // //     this.failedRegister = false;
  // //   }
  // }
}