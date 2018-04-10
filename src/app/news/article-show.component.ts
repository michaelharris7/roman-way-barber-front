import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Article } from './article';

@Component({
  selector: 'article-show',
  templateUrl: 'article-show.component.html',
  styleUrls: ['article.component.css']
})

export class ArticleShowComponent implements OnInit {
  id: number;
  routeId: any;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeId = this.route.params.subscribe(
      params => {
        this.id = +params['id'];
      }
    )
  }
}