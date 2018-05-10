import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Angular2TokenService, UserData } from 'angular2-token';
import { AuthenticationService } from '../authentication/authentication.service';
import { ArticleService } from './article.service';
import { Article } from './article';
import { FeaturedArticle } from './featured-article';
import { CommentUser } from './comment-user';
import { Comment } from './comment';
import { OrderPipe } from 'ngx-order-pipe';


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
  comments: Comment[];
  newComment = new Comment;
  oldComment: Comment = <Comment>{};
  featuredArticle = new FeaturedArticle;
  featuredArticles: FeaturedArticle[];
  routeId: any;
  errorMessage: any;
  returnUrl: string;
  editBtnClicked: boolean = false;
  createCommentClicked: boolean = false;
  commentUserLoaded: boolean = false;
  private timerStopper;
  order: string = 'updated_at';

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: Angular2TokenService,
    private authService: AuthenticationService,
    private articleService: ArticleService,
    private orderPipe: OrderPipe
  ) {}

  @Input() article: Article;


  ngOnInit() {
    this.oldComment.id = 0;
    if(this.isLoggedIn()) {
      this.tokenService.validateToken().subscribe(
        res => {
          this.userData = this.tokenService.currentUserData;
          this.getCommentUsers();
          this.getFeaturedArticles()
        },
        err => console.log(err));
      this.userType = this.tokenService.currentUserType;
    }
    let timer = Observable.timer(0, 5000);
    this.timerStopper = timer.subscribe(() => {
         this.getComments();
         this.getFeaturedArticles()
        });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/news';
    let articleRequest = this.route.params
        .flatMap((params: Params) =>
          this.articleService.getArticle(+params['id']));
    articleRequest.subscribe(response => this.article = response.json());
  }
  ngOnDestroy() {
    this.timerStopper.unsubscribe();
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


  // Featured Article Functions
  getFeaturedArticles() {
    this.articleService.getFeaturedArticles()
    .subscribe(
      featuredArticles => {
        this.featuredArticles = featuredArticles
      },
      error => {
        this.errorMessage = <any>error;
        console.log(error);
      }
    );
  }
  updateFeaturedArticles(featuredArticle: FeaturedArticle) {
    let featuredArticleId = this.searchFeaturedArticles(this.article.id);
    console.log(featuredArticleId);
    if(featuredArticleId > 0) {
      this.deleteFeaturedArticle(featuredArticleId);
      this.getFeaturedArticles();
    } else if(this.featuredArticles.length < 3) {
      this.createFeaturedArticle(this.featuredArticle);
      this.getFeaturedArticles();
    } else {
      console.log('There are too many articles featured right now.');
    }
  }
  searchFeaturedArticles(articleId:number): number {
    for(let featuredArticle of this.featuredArticles) {
      if(featuredArticle.article_id === articleId) {
        return featuredArticle.id;
      }
    }
    return 0;
  }
  createFeaturedArticle(featuredArticle: FeaturedArticle) {
    featuredArticle.article_id = this.article.id;
    featuredArticle.title = this.article.title;
    featuredArticle.content = this.article.content;

    this.articleService.createFeaturedArticle(featuredArticle)
        .subscribe(
          res => {
            console.log(res);
            setTimeout(() => {
              this.getFeaturedArticles();
            });
          },
          err => {
            console.log(err);
            return Observable.throw(err);
          }
        );
  }
  deleteFeaturedArticle(id:number) {
    this.articleService.deleteFeaturedArticle(id)
      .subscribe(
        res => {
          console.log(res)
          setTimeout(() => {
            this.getFeaturedArticles();
          });
        },
        err => {
          this.errorMessage = err;
          console.log(err);
        }
      );
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
    // this.userData = this.tokenService.currentUserData;
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
  getComments() {
    this.articleService.getComments()
    .subscribe(
      comments => this.comments = comments,
      error => {
        this.errorMessage = <any>error;
        console.log(error);
      }
    );
  }
  showCommentForm() {
    this.getCommentUsers();
  }
  createComment(comment) {
    this.createCommentClicked = !this.createCommentClicked;
    comment.comment_user_id = this.commentUser.id;
    comment.article_id = this.article.id;
    this.articleService.createComment(comment)
    .subscribe(
      res => {
        console.log(res);
        setTimeout(() => {
          this.getComments();
        });
      },
      err => {
        console.log(err);
        return Observable.throw(err);
      }
    );
  }
  editComment(comment: Comment) {
    this.oldComment = comment;
    this.newComment = comment;
  }
  updateComment(comment: Comment) {
    if((this.oldComment.id !== 0) && (this.oldComment.id === comment.id))
    {
      console.log(this.oldComment.id);
      console.log(comment.id);
      console.log('Update Comment');
      this.articleService.updateComment(comment)
        .subscribe(
          res => {
            console.log(res);
            setTimeout(() => {
              this.getComments();
            });
          },
          err => {
            console.log(err);
            return Observable.throw(err);
          }
        );
      this.oldComment.id = 0;
    } else {
      this.createComment(comment);
    }
  }
  deleteComment(comment: Comment) {
    this.articleService.deleteComment(comment.id)
      .subscribe(
        res => {
          console.log(res)
          setTimeout(() => {
            this.getComments();
          });
        },
        err => this.errorMessage = err
      );
  }
  commentEdited(comment):string {
    if(comment.created_at === comment.updated_at) {
      return 'posted';
    } else {
      return 'edited';
    }
  }


  //Account Functions
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  isAdmin(): boolean {
    return (this.isLoggedIn() && this.userType === 'ADMIN');
  }
}