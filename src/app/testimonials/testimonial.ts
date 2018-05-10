export class Testimonial {
  constructor(
    public id?: number,
    public content?: string,
    public testimonial_user_id?: number,
    public custom_user?: string,
    public testimonial_user?: {
      id?: number,
      user_id?: number,
      user_type?: string,
      user_name?: string
    }
  ) {}
}