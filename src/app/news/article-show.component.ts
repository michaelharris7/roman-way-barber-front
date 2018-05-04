import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Angular2TokenService, UserData } from 'angular2-token';
import { AuthenticationService } from '../authentication/authentication.service';
import { ArticleService } from './article.service';
import { Article } from './article';
import { CommentUser } from './comment-user';
import { Comment } from './comment';


@Component({
  selector: 'article-show',
  templateUrl: 'article-show.component.html',
  styleUrls: ['article.component.css']
})

export class ArticleShowComponent implements OnInit {
  id: number;
  userType: string;
  userData: UserData = <UserData>{};
  commentUser: CommentUser = <CommentUser>{};
  commentUsers: CommentUser[];
  comment = new Comment;
  routeId: any;
  errorMessage: any;
  returnUrl: string;
  editBtnClicked: boolean = false;
  createCommentClicked: boolean = false;
  // commentSubmitted: boolean = false;

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: Angular2TokenService,
    private authService: AuthenticationService,
    private articleService: ArticleService
  ) {}

  @Input() article: Article;

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/news';
    this.routeId = this.route.params.subscribe(
      params => {
        this.id = +params['id'];
      }
    );
    let articleRequest = this.route.params
        .flatMap((params: Params) =>
          this.articleService.getArticle(+params['id']));
    articleRequest.subscribe(response => this.article = response.json());
  }


  //Article Functions
  updateArticle(article: Article) {
    this.editBtnClicked = !this.editBtnClicked;
    this.articleService.updateArticle(article)
      .subscribe(data => {
        return true
      }, error => {
        console.log('Error edditing Article');
        return Observable.throw(error);
      })
  }
  deleteArticle(article: Article) {
    this.articleService.deleteArticle(this.article.id)
      .subscribe(data => {
        this.router.navigate([this.returnUrl]);
      },
        error => this.errorMessage = error);
  }


  //CommentUser functions
  findCommentUserId(user_id:number, user_type:string):number {
    for(let commentUser of this.commentUsers) {
      if((commentUser.user_id === user_id) && (commentUser.user_type === user_type))
        return commentUser.id;
    }
  }
  getCommentUser() {
    let user_id = this.findCommentUserId(this.userData.id, this.userType);
    console.log(user_id);
    let commentUserRequest = this.articleService.getCommentUser(user_id);
    commentUserRequest.subscribe(
      res => this.commentUser = res.json(),
      err => console.log(err)
    );
  }
  getCommentUsers() {
    this.userData = this.tokenService.currentUserData;
    this.userType = this.tokenService.currentUserType;
    this.articleService.getCommentUsers()
    .subscribe(
      commentUsers => {
        this.commentUsers = commentUsers;

      if(this.commentUsers)
        this.getCommentUser();
      },
      err => console.log(err)
    );
  }


  //Comment Functions
  showCommentForm() {
    this.createCommentClicked = !this.createCommentClicked;
    this.getCommentUsers();
  }
  createComment(comment) {
    this.createCommentClicked = !this.createCommentClicked;
    comment.comment_user_id = this.commentUser.id;
    comment.article_id = this.article.id;
    this.articleService.createComment(comment)
    .subscribe(
      res => { console.log(res);
      return true; },
      err => {
        console.log(err);
        return Observable.throw(err);
      }
    );
  }
  updateComment(comment: Comment) {
    // this.editBtnClicked = !this.editBtnClicked;
    // this.articleService.updateComment(comment)
    //   .subscribe(data => {
    //     return true
    //   }, error => {
    //     console.log('Error edditing Article');
    //     return Observable.throw(error);
    //   })
  }
  deleteComment(comment: Comment) {
    // this.articleService.deleteComment(this.comment.id)
    //   .subscribe(data => {
    //     this.router.navigate([this.returnUrl]);
    //   },
    //     error => this.errorMessage = error);
  }


  //Account Functions
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  isAdmin(): boolean {
    return (this.isLoggedIn() && this.userType === 'ADMIN');
  }
}