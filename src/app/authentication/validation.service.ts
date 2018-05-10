import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {AbstractControl} from '@angular/forms';


// Validation Messages
export class ValidationService {
  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config = {
      'requiredEmail': 'An email address is required',
      'invalidEmailAddress': 'Please enter a valid email address',
      'requiredPassword': 'A password is required',
      'invalidPassword': 'Password must include letters and numbers at least 8 characters long',
      'minlength': `Minimum length ${validatorValue.requiredLength}`
    };
    return config[validatorName];
  }


  // Email Validation
  static emailRequired(control) {
    return control.value ? null : { 'requiredEmail': true };
  }
  static emailValidator(control) {
    return control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/) ?
      null : { 'invalidEmailAddress': true };
  }


  // Password Validation
  static passwordRequired(control) {
    return control.value ?
      null : { 'requiredPassword': true };
  }
  static passwordValidator(control) {
    return control.value.match(/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9-_+=[\]{}\|:,?\/\\`~"'();.!@#$%^&*]{8,20}$/) ?
      null : { 'invalidPassword': true };
  }
  static passwordMatch(AC: AbstractControl) {
    let password = AC.get('password').value;
    let passwordConfirmation = AC.get('passwordConfirmation').value;
    return (password === passwordConfirmation) ?
      null : AC.get('passwordConfirmation').setErrors( {'passwordMismatch': true} )
  }
}