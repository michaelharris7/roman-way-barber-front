import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Angular2TokenService, UserData } from 'angular2-token';
import { AuthenticationService } from '../authentication/authentication.service';
import { TestimonialService } from './testimonial.service';
import { TestimonialUser } from './testimonial-user';
import { Testimonial } from './testimonial';
import { FeaturedTestimonial } from './featured-testimonial';
import { OrderPipe } from 'ngx-order-pipe';


@Component({
  templateUrl: 'testimonial-show.component.html'
})

export class TestimonialShowComponent implements OnInit {
  id: number;
  userType: string;
  userData: UserData = <UserData>{};
  testimonialUser: TestimonialUser = <TestimonialUser>{};
  testimonialUsers: TestimonialUser[];
  testimonials: Testimonial[];
  featuredTestimonial = new FeaturedTestimonial;
  featuredTestimonials: FeaturedTestimonial[];
  returnUrl: string;
  editBtnClicked: boolean = false;

  @Input() testimonial: Testimonial;


  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: Angular2TokenService,
    private authService: AuthenticationService,
    private testimonialService: TestimonialService
  ) {}

  ngOnInit() {
    this.loginVerification()
    this.getTestimonial();
    this.getFeaturedTestimonials();
  }


  // Testimonial Function
  getTestimonial() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/testimonials';
    let testimonialRequest = this.route.params
        .flatMap((params: Params) =>
          this.testimonialService.getTestimonial(+params['id']));
    testimonialRequest.subscribe(response => this.testimonial = response.json());
  }
  updateTestimonial(testimonial: Testimonial) {
    this.editBtnClicked = !this.editBtnClicked;
    this.testimonialService.updateTestimonial(testimonial)
      .subscribe(data => {
        return true
      }, error => {
        console.log('Error edditing Testimonial');
        return Observable.throw(error);
      })
  }
  deleteTestimonial(testimonial: Testimonial) {
    this.testimonialService.deleteTestimonial(this.testimonial.id)
      .subscribe(data => {
        this.router.navigate([this.returnUrl]);
      },
        error => console.log(error));
  }


  // Featured Testimonial Functions
  getFeaturedTestimonials() {
    this.testimonialService.getFeaturedTestimonials()
    .subscribe(
      featuredTestimonials => {
        this.featuredTestimonials = featuredTestimonials
      },
      err => console.log('Error getting featured testimonials: ' + err)
    );
  }
  updateFeaturedTestimonials(featuredTestimonial: FeaturedTestimonial) {
    let featuredTestimonialId = this.searchFeaturedTestimonials(this.testimonial.id);
    console.log(featuredTestimonialId);
    if(featuredTestimonialId > 0) {
      this.deleteFeaturedTestimonial(featuredTestimonialId);
      this.getFeaturedTestimonials();
    } else if(this.featuredTestimonials.length < 2) {
      this.createFeaturedTestimonial(this.featuredTestimonial);
      this.getFeaturedTestimonials();
    } else {
      console.log('There are too many testimonials featured right now.');
    }
  }
  searchFeaturedTestimonials(testimonialId:number): number {
    for(let featuredTestimonial of this.featuredTestimonials) {
      if(featuredTestimonial.testimonial_id === testimonialId) {
        return featuredTestimonial.id;
      }
    }
    return 0;
  }
  createFeaturedTestimonial(featuredTestimonial: FeaturedTestimonial) {
    featuredTestimonial.testimonial_id = this.testimonial.id;
    featuredTestimonial.content = this.testimonial.content;
    featuredTestimonial.user_name = this.testimonial.testimonial_user.user_name;
    featuredTestimonial.custom_user = this.testimonial.custom_user;

    this.testimonialService.createFeaturedTestimonial(featuredTestimonial)
        .subscribe(
          res => {
            console.log(res);
            setTimeout(() => {
              this.getFeaturedTestimonials();
            });
          },
          err => {
            console.log(err);
            return Observable.throw(err);
          }
        );
  }
  deleteFeaturedTestimonial(id:number) {
    this.testimonialService.deleteFeaturedTestimonial(id)
      .subscribe(
        res => {
          console.log(res)
          setTimeout(() => {
            this.getFeaturedTestimonials();
          });
        },
        err => console.log('Error deleting featured testimonials: ' + err)
      );
  }


  //TestimonialUser functions
  findTestimonialUserId(user_id:number, user_type:string):number {
    for(let testimonialUser of this.testimonialUsers) {
      if((testimonialUser.user_id === user_id) && (testimonialUser.user_type === user_type))
        return testimonialUser.id;
    }
  }
  getTestimonialUser() {
    let user_id = this.findTestimonialUserId(this.userData.id, this.userType);
    console.log(user_id);
    let testimonialUserRequest = this.testimonialService.getTestimonialUser(user_id);
    testimonialUserRequest.subscribe(
      res => this.testimonialUser = res.json(),
      err => console.log(err)
    );
  }
  getTestimonialUsers() {
    // this.userData = this.tokenService.currentUserData;
    this.testimonialService.getTestimonialUsers()
    .subscribe(
      testimonialUsers => {
        this.testimonialUsers = testimonialUsers;

      if(this.testimonialUsers)
        this.getTestimonialUser();
      },
      err => console.log(err)
    );
  }


  // Account Functions
  loginVerification() {
    if(this.isLoggedIn()) {
      this.tokenService.validateToken().subscribe(
        res => {
          this.userData = this.tokenService.currentUserData;
          this.userType = this.tokenService.currentUserType;
          this.getTestimonialUsers();
        },
        err => {
          console.log('No user logged in. Logging out:' + err);
          this.logOut();
        }
      );
    }
  }
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  logOut() {
    this.authService.logOut().subscribe(
        res => { return true },
        err => { console.log('There was an error in logging out:' + err); }
      );
  }
  isAdmin(): boolean {
    return (this.isLoggedIn() && this.userType === 'ADMIN');
  }
}