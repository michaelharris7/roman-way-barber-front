import { Component, OnInit, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MarkdownService } from 'angular2-markdown';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private markdown: MarkdownService
  ) {router.events.subscribe(() => {
      this.redirectOnAccount();
    });
  }

  ngOnInit() {
    this.markDownSetUp();
    console.log(document.location.hostname);
  }

  markDownSetUp() {
    this.markdown.renderer.table = (header: string, body: string) => {
      return `
      <table class="markdown-table">
        <thead>
          ${header}
        </thead>
        <tbody>
          ${body}
        </tbody>
      </table>
      `;
    }
    this.markdown.renderer.blockquote = (quote: string) => {
      return `<blockquote class="markdown-quote">${quote}</blockquote>`;
    }
  }
  isAccountPage() {
    switch (document.location.pathname)
    {
    case'/register':
    case'/login':
    case'/forgot-password':
    case'/account':
      return true;
    default:
      return false;
    }
  }
  redirectOnAccount() {
    console.log("redirect if on account: " + document.location.href);
    console.log("document.location.protocol: " + document.location.protocol);
    if (this.isAccountPage()) {
      if (document.location.protocol === 'http:') {
        document.location.href = 'https://evansbarberstylist.herokuapp.com' + document.location.pathname;
        console.log("redirecting in process... " + document.location.href);
      }
    } else {
      if (document.location.hostname !== 'evansbarberstylist.com') {
        document.location.href = 'http://evansbarberstylist.com' + document.location.pathname;
        console.log("redirecting in process... " + document.location.href);
      }
    }
    console.log("redirect occured: " + document.location.href);
  }
}