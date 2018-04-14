// import { RegisterData as RegisterDataBase } from 'angular2-token';
// import { UserData as UserDataBase } from 'angular2-token';
import { RegisterData } from 'angular2-token';
import { UserData } from 'angular2-token';


export interface RegisterDataExtended extends RegisterData {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  type?: string;
}

export interface UserDataExtended extends UserData {
  first_name: string;
  last_name?: string;
}


// export { RegisterDataExtended as RegisterData }
// export { UserDataExtended as UserData }
