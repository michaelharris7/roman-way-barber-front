export class User {
  constructor(
    public userType?: string,
    public name?: string,
    public email: string = '',
    public password: string = '',
    public passwordConfirmation: string = '',
  ) {}
}