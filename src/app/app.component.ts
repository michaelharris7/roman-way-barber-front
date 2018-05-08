import { Component, OnInit } from '@angular/core';
import { MarkdownService } from 'angular2-markdown';
import { Angular2TokenService, UserData, UserType } from 'angular2-token';
import { AuthenticationService } from './authentication/authentication.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public userData: UserData = <UserData>{};
  public userType: string;

  constructor(
    private _markdown: MarkdownService,
    private tokenService: Angular2TokenService,
    private authService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.markDownSetUp();
  }


  markDownSetUp() {
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