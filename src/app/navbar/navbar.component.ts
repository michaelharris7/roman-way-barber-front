import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Angular2TokenService } from 'angular2-token';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  public currentPath: string = "";

  constructor(
    private router: Router
    // public tokenAuthService:Angular2TokenService
  ) {}

  ngOnInit() {
    this.router.events.subscribe((res) => {
      this.currentPath = this.router.url;
    });
  }

  onServicesPage() {
    return this.currentPath.indexOf('/services') !== -1;
  }
  onNewsPage() {
    return this.currentPath.indexOf('/news') !== -1;
  }
}