import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Angular2TokenService, UserData } from 'angular2-token';
import { TestimonialUser } from './testimonial-user';
import { Testimonial } from './testimonial';


@Injectable()
export class TestimonialService {
  headers: Headers;
  options: RequestOptions;
  private testimonialUsersUrl = 'http://localhost:3002/testimonial_users';
  private testimonialsUrl = 'http://localhost:3002/testimonials';

  constructor(
    private http: Http,
  ) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: this.headers });
  }


  // TestimonialUser functions
  getTestimonialUsers(): Observable<TestimonialUser[]> {
    return this.http.get(this.testimonialUsersUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getTestimonialUser(id: number) {
    return this.http.get(this.testimonialUsersUrl + "/" + id + ".json");
  }
  createTestimonialUser(commentUser: TestimonialUser): Observable<TestimonialUser> {
    return this.http.post(this.testimonialUsersUrl, JSON.stringify(commentUser), this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  updateTestimonialUser(commentUser: TestimonialUser): Observable<TestimonialUser> {
    const url = `${this.testimonialUsersUrl}/${commentUser.id}`;
    return this.http.put(url, JSON.stringify(commentUser), this.options)
      .map((this.extractData))
      .catch(this.handleError);
  }
  deleteTestimonialUser(id: number): Observable<TestimonialUser> {
    const url = `${this.testimonialUsersUrl}/${id}`;
    return this.http.delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }


  // Testimonial functions
  getTestimonials(): Observable<Testimonial[]> {
    return this.http.get(this.testimonialsUrl)
                    .map(this.extractData)
                    .catch(this.handleError);
  }
  getTestimonial(id: number) {
    return this.http.get(this.testimonialsUrl + "/" + id + ".json");
  }
  createTestimonial(testimonial: Testimonial): Observable<Testimonial> {
    return this.http.post(this.testimonialsUrl, JSON.stringify(testimonial),
      this.options).map(this.extractData)
          .catch(this.handleError);
  }
  updateTestimonial(testimonial: Testimonial): Observable<Testimonial> {
    const url = `${this.testimonialsUrl}/${testimonial.id}`;
    return this.http.put(url, JSON.stringify(testimonial),
      this.options).map((this.extractData))
          .catch(this.handleError);
  }
  deleteTestimonial(id: number): Observable<Testimonial> {
    const url = `${this.testimonialsUrl}/${id}`;
    return this.http.delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }


  // General data extraction
  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }
  private handleError (error: any): Promise<any> {
    console.error('An error occured ', error);
    return Promise.reject(error.message || error);
  }
}