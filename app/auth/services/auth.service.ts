import { tokenNotExpired } from 'angular2-jwt';
/*import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';*/


export class AuthService {

  constructor() {

  }

  loggedIn() {
    return tokenNotExpired();
  }

  login(email:String, password:String) {
      //this.http.post("//api/authenticate", {email: email,password:password}).map(res => res.json()).subscribe(msg => {console.log(msg)}, error => console.log(error));
  }

}
