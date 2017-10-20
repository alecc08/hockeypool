import { Component, Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Md5 } from 'ts-md5/dist/md5';
@Component({
  template: `

  <h3>Register</h3>
  <div class="card">
    <div class="card-block">
      <h2 class="card-title">Create a new account</h2>
      <form>
        <div class="form-group row">
          <label for="inputName" class="col-sm-2 col-form-label">Full Name</label>
          <div class="col-sm-10">
            <input type="text" [(ngModel)]="inputName" class="form-control" name="inputName" id="inputName" placeholder="John Smith">
          </div>
        </div>
        <div class="form-group row">
          <label for="inputEmail" class="col-sm-2 col-form-label">Email</label>
          <div class="col-sm-10">
            <input type="email" [(ngModel)]="inputEmail" class="form-control" name="inputemail" id="inputEmail" placeholder="example@gmail.com">
          </div>
        </div>
        <div class="form-group row">
          <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
          <div class="col-sm-10">
            <input type="password" [(ngModel)]="inputPassword" class="form-control" name="inputpw" id="inputPassword" placeholder="*******">
          </div>
        </div>
        <div class="form-group row">
          <label for="inputPassword2"  class="col-sm-2 col-form-label">Confirm</label>
          <div class="col-sm-10">
            <input type="password" class="form-control"  [(ngModel)]="inputPassword2"  id="inputPassword2" name="inputpw" placeholder="Confirm Password">
          </div>
        </div>
        <div class="alert alert-danger" role="alert" *ngIf="errorMessage">{{errorMessage}}</div>
        <div class="alert alert-success" role="alert" *ngIf="successMessage">{{successMessage}}</div>
        <div class="form-group row">
          <div class="offset-sm-2 col-sm-10">
            <button (click)="register()" [disabled]="!isValid()" class="btn btn-primary">Create Account</button>
          </div>

        </div>
      </form>
    </div>
  </div>
  `
})
@Injectable()
export class RegisterComponent {

  registerUrl:string = "/api/newuser";

  errorMessage:String;
  successMessage:String;

  inputEmail:String;
  inputPassword:String;
  inputPassword2:String;
  inputName:String;

  setError(msg) {
    this.successMessage = null;
    this.errorMessage = msg;
  }

  setSuccess(msg) {
    this.successMessage = msg;
    this.errorMessage = null;
  }

  constructor(private http:Http) {
  }

  register() {
    let body = JSON.stringify({ "email": this.inputEmail,"password": Md5.hashStr("sodium"+this.inputPassword.toString()), "name": this.inputName });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, method: "post" });

    return this.http.post(this.registerUrl, body,options)
            .subscribe(//call the post
                data => this.handleResponse(data.text()), // put the data returned from the server in our variable
                error => console.log("Error HTTP Post Service"), // in case of failure show this message
                () => console.log("Job Done Post !")//run this code in all cases
            );
  }

  handleResponse(data) {
    try {
      console.log(data);
      data = JSON.parse(data);
      if(data && data.success) {
        this.setSuccess(data.message);
      }
      else {
        this.setError(data.message);
      }
    } catch(e) {
      console.log(e);
    }

  }

  isValid() {
    let ok = true;
    ok = ok && (this.inputName && this.inputName.length > 1);
    ok = ok && (this.inputEmail && this.inputEmail.length > 1);
    ok = ok && (this.inputPassword && this.inputPassword.length > 1 && this.inputPassword == this.inputPassword2);
    return ok;
  }
}
