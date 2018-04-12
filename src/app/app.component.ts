import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { MarkdownService } from 'angular2-markdown';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app';
  today: Date = new Date();

  public currentPath: string = "";

  constructor(
    private router: Router,
    private _markdown: MarkdownService
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

    this._markdown.renderer.table = (header: string, body: string) => {
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
    this._markdown.renderer.blockquote = (quote: string) => {
      return `<blockquote class="markdown-quote">${quote}</blockquote>`;
    }
  }

  onServicesPage() {
    return this.currentPath.indexOf('/services') !== -1;
  }
  onNewsPage() {
    return this.currentPath.indexOf('/news') !== -1;
  }
}