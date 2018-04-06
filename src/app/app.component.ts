import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  today: Date = new Date();

  public href: string = "";

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((res) => {
      this.href = this.router.url;
    })
  }
}