import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent implements OnInit {
  today: Date = new Date();

  public currentPath: string = "";

  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.router.events.subscribe((res) => {
      this.currentPath = this.router.url;
    });

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
            return;
      }
      window.scrollTo(0, 0)
    });
  }
  onServicesPage() {
    return this.currentPath.indexOf('/services') !== -1;
  }
  onNewsPage() {
    return this.currentPath.indexOf('/news') !== -1;
  }


  // Logging Functions
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  isLoggedOut(): boolean {
    return !this.authService.isLoggedIn();
  }
  logOut() {
    this.authService.logOut().subscribe(
      res => console.log(res),
      error => {
        console.log("Error logging out: " + error);
        return Observable.throw(error);
      }
    );
  }
}