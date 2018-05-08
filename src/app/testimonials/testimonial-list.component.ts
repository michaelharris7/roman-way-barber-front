import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';


@Component({
  templateUrl: './testimonial-list.component.html',
  styleUrls: ['./testimonial.component.css']
})

export class TestimonialListComponent {

  constructor(
    private authService: AuthenticationService
  ) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}