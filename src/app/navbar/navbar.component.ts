import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Angular2TokenService } from 'angular2-token';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  currentPath: string = '';

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    this.router.events.subscribe((res) => {
      this.currentPath = this.router.url;
    });
  }

  isServicePage() {
    return this.currentPath.indexOf('/services') !== -1;
  }

  isNewsPage() {
    return this.currentPath.indexOf('/news') !== -1;
  }

  isNewLayout() {
    switch (this.currentPath)
    {
    // On a standard page
    case'/':
    case'/home':
    case'/services':
    case'/services/haircut':
    case'/services/razorcut':
    case'/services/trim':
    case'/about':
    case'/contact':
      return false;
    default:
      return true;
    }
  }

}