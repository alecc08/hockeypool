import { Component, Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthHttp, JwtHelper } from 'angular2-jwt';
import {Md5} from 'ts-md5/dist/md5';

@Component({
  template: `
  <div [@fade]>
    <div>
      <div class="card-header">
        <h3>Account Settings</h3>
      </div>
      <div class="card">
        <div class="card-block">

        <div class="form-group row">
          <label for="homePage" class="col-form-label">Main page: </label>
          <select class="custom-select mb-2 mr-sm-2 mb-sm-0" id="homePage" [(ngModel)]="mainPageSetting" (change)="mainPagePreferenceChange()">
            <option value="home">Home page</option>
            <option value="pool">Main Pool</option>
          </select>
          <span class="alert alert-success" role="alert" *ngIf="mainPageMessageSuccess">{{mainPageMessageSuccess}}</span>
        </div>

        <h4>Change password</h4>
        <form>
          <div class="form-group row">
            <input type="password" class="form-control" id="passwordNew1" name="passwordNew1" placeholder="New password" required [(ngModel)]="passwordNew1" />
          </div>
          <div class="form-group row">
            <input type="password" class="form-control" id="passwordNew2" name="passwordNew2"  placeholder="Repeat new password" required [(ngModel)]="passwordNew2" />
          </div>
          <div class="form-group row">
            <button (click)="passwordChange()" [disabled]="!isValid()" class="btn btn-primary">Change</button>
          </div>
        </form>
        <span class="alert alert-danger" role="alert" *ngIf="error">{{error}}</span>
        <span class="alert alert-success" role="alert" *ngIf="success">{{success}}</span>
        </div>
      </div>
    </div>

  </div>
  `,
  animations: [
  trigger('fade', [
    transition('void => *', [
      style({opacity: 0}),
      animate('500ms ease-in', style({opacity: 1}))
    ])
  ])
]
})
@Injectable()
export class MyAccountComponent {

  account;
  success;
  error;

  accountUrl="/api/account";

  passwordNew1:String;
  passwordNew2;
  mainPageMessageSuccess;
  mainPageSetting;

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private http:AuthHttp, private router:Router) {
  }

  ngOnInit() {
    this.mainPageSetting = this.jwtHelper.decodeToken(localStorage.getItem('id_token'))._doc.mainPage || "home";
    console.log(this.mainPageSetting);
  }

  mainPagePreferenceChange() {
    this.http.put(this.accountUrl, {
      mainPage: this.mainPageSetting
    }).subscribe(//call the post
        data => this.handlePagePrefChangeResponse(data), // put the data returned from the server in our variable
        error => {}, // in case of failure show this message
        () => {} //run this code in all cases
    );
  }

  handlePagePrefChangeResponse(data) {
    data = data.json();
    JSON.stringify(data);
    if(data.success) {
      this.mainPageMessageSuccess = data.message;
    } else {
      this.mainPageMessageSuccess = null;
    }
  }

  passwordChange() {
    this.http.put(this.accountUrl, {
      password: Md5.hashStr("sodium"+this.passwordNew1)
    }).subscribe(//call the post
        data => this.handlePasswordChangeResponse(data), // put the data returned from the server in our variable
        error => {}, // in case of failure show this message
        () => {} //run this code in all cases
    );
    this.passwordNew1 = "";
    this.passwordNew2 = "";
  }

  handlePasswordChangeResponse(data) {
    data = data.json();
    if(data.success) {
      this.success = data.message;
    } else {
      this.error = "Failed to change password";
    }
  }

  isValid() {
    if(this.passwordNew1 && this.passwordNew2 && this.passwordNew1.length > 0 && this.passwordNew1 == this.passwordNew2) {
      return true;
    }
    return false;
  }

  handleResponse(data) {
    try {
      data = JSON.parse(data);
      if(data.success) {
        this.success = data.message;
        this.error = null;
      } else {
        this.success = null;
        this.error = data.message;
      }

    } catch(e) {
      console.log(e);
    }

  }



}
