import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MarkdownService } from 'angular2-markdown';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private markdown: MarkdownService
  ) {
    router.events.subscribe(() => {
      this.redirectOnAccount();
    });
  }

  ngOnInit() {
    this.markDownSetUp();
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
    switch (location.pathname)
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
    if (this.isAccountPage() && (location.hostname === 'www.evansbarberstylist.com')) {
      location.href = 'https://evansbarberstylist.herokuapp.com' + location.pathname;
    }
  }
}