import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from './validation.service';


@Component({
  selector: 'control-messages',
  template: `<div class="form-group alert alert-danger mt-3" *ngIf="errorMessage">{{errorMessage}}</div>`
})

export class ControlMessagesComponenet {

  @Input() control: FormControl;
  constructor() { }


  get errorMessage() {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  }
}