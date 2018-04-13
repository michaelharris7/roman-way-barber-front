import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators, EmailValidator } from '@angular/forms';

@Component({
  selector: 'example-app',
  templateUrl: './form-tests.component.html'
})
export class FormTestsComponent {
  form: FormGroup;

  constructor(@Inject(FormBuilder) fb: FormBuilder) {
    this.form = fb.group({
      name: fb.group({
        first: ['Nancy', Validators.minLength(2)],
        last: 'Drew',
        email: ['', EmailValidator],
      }),
    });
  }
}