import { Component, OnInit } from '@angular/core';
import { MarkdownService } from 'angular2-markdown';
import { Angular2TokenService } from 'angular2-token';
import { environment } from '../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constructor(
    private _markdown: MarkdownService
  ) {}

  ngOnInit() {
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
}