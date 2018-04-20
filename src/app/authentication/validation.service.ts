import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

export class ValidationService {
  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
      let config = {
        'requiredEmail': 'An email address is required',
        'requiredPassword': 'A password is required',
        // 'invalidCreditCard': 'Is invalid credit card number',
        'invalidEmailAddress': 'Please enter a valid email address',
        'invalidPassword': 'Password must include letters and numbers at least 6 characters long',
        'unmatchedPassword': 'Both passwords must match',
        'minlength': `Minimum length ${validatorValue.requiredLength}`
    };
    return config[validatorName];
  }

    // static creditCardValidator(control) {
    //     // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    //     if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
    //         return null;
    //     } else {
    //         return { 'invalidCreditCard': true };
    //     }
    // }
    static emailRequired(control) {
      return control.value ? null : { 'requiredEmail': true };
    }
    static emailValidator(control) {
        // RFC 2822 compliant regex
      return control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/) ?
        null : { 'invalidEmailAddress': true };
    }

    static passwordRequired(control) {
      return control.value ?
        null : { 'requiredPassword': true };
    }
    static passwordValidator(control) {
      // {6,20}           - Assert password is between 6 and 20 characters
      // (?=.*[0-9])       - Assert a string has at least one number
      // (?=.*[a-zA-Z])       - Assert a string has at least one letter
      return control.value.match(/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9-_+=[\]{}\|:',?\/\\`~"();.!@#$%^&*]{6,100}$/) ?
        null : { 'invalidPassword': true };
    }
    // static passwordMatchValidator(g: FormGroup) {
    //   return g.get('password').value === g.get('passwordConfirm').value
    //   ? null : {'unmatchedPassword': true};
    // }
}