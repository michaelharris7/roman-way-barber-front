import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsPost } from './news.post';

@Component({
  selector: 'news',
  templateUrl: 'news.component.html',
  styleUrls: ['news.component.css']
})

export class NewsComponent implements OnInit {
  newsPosts: NewsPost[];

  constructor() {}

  ngOnInit() {

  }
}