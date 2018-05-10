import { Component, OnInit } from '@angular/core';
import { MarkdownService } from 'angular2-markdown';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

  constructor(
    private markdown: MarkdownService
  ) {}

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
}