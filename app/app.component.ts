import { Component, Injectable } from '@angular/core';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'app',
  template: `

  <nav class="bigshadow navbar navbar-toggleable-sm navbar-light bg-faded navbar-inverse bg-inverse">
  <div class="container">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse mt-2 mt-lg-0" id="navbarToggler">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item"><a routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-link"><i class="fa fa-home"></i> Home</a></li>
        <li class="nav-item"><a *ngIf="loggedIn()" routerLink="/pool/view" routerLinkActive="active" class="nav-link" ><i class="fa fa-star-o"></i> My Pools</a></li>
        <li class="nav-item"><a *ngIf="loggedIn()" routerLink="/stats" routerLinkActive="active" class="nav-link" ><i class="fa fa-bar-chart"></i> All Stats</a></li>
        <li class="nav-item"><a *ngIf="loggedIn()" routerLink="/pool/create" routerLinkActive="active" class="nav-link" ><i class="fa fa-plus-square"></i> Create Pool</a></li>
        <li class="nav-item"><a *ngIf="loggedIn()" routerLink="/account" routerLinkActive="active" class="nav-link"><i class="fa fa-id-badge"></i> Account</a></li>
      </ul>
      <div class="navbar-text">
        <form class="form-inline">
          <input type="text" class="form-control form-control-sm" [(ngModel)]="emailInput" *ngIf="!loggedIn()" placeholder="Email" name="email" width="20">
          <input type="password" class="form-control form-control-sm" [(ngModel)]="passwordInput" *ngIf="!loggedIn()" placeholder="Password" name="password">
          <button id="login" (click)="login()" class="btn btn-sm btn-outline-secondary form-control form-control-sm" *ngIf="!loggedIn()"><i class="fa fa-sign-in"></i> Log In</button>
          <button id="logout" (click)="logout()" class="btn btn-sm btn-outline-secondary form-control form-control-sm" *ngIf="loggedIn()"><i class="fa fa-sign-out"></i> Log Out</button>
          <a routerLink="/register" routerLinkActive="active" class="btn" *ngIf="!loggedIn()">Register</a>
        </form>
      </div>
    </div>
  </div>
</nav>

<div class="container">
  <div class="bigshadow jumbotron header">
      <h2 class="display-4 headerText">Al's Hockey Pool</h2>
  </div>
</div>


<div class="container" style="margin-top:-30px;">
    <router-outlet></router-outlet>
    <div class="footer">
        <hr class="m-y-2"/>
        <p>Copyright 2017&copy; Alec Chamberland</p>
    </div>
</div>
  `
})

@Injectable()
export class AppComponent {
  emailInput:String;
  passwordInput:String;

  loginUrl = "/api/authenticate";
  poolUrl = "/api/pool";

  jwtHelper:JwtHelper = new JwtHelper();

  constructor(private http:Http, private router:Router) {

  }

  login() {
    let body = JSON.stringify({ "email":this.emailInput,"password":Md5.hashStr("sodium"+this.passwordInput.toString()) });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, method: "post" });

    this.http.post(this.loginUrl, body,options)
        .subscribe(//call the post
            data => this.handleLoginResponse(data.text()), // put the data returned from the server in our variable
            error => console.log("Error HTTP Post Service"), // in case of failure show this message
            () => console.log("Job Done Post !")//run this code in all cases
        );
  }


  loggedIn() {
    return tokenNotExpired();
  }

  logout() {
    console.log("Removing id_token");
    localStorage.removeItem('id_token');
    this.router.navigate(["unauthorized"]);
  }

  handleLoginResponse(data) {
    try {
      console.log(data);
      data = JSON.parse(data);
      if(data && data.success) {
        localStorage.setItem('id_token', data.token);
        if(this.jwtHelper.decodeToken(data.token)._doc.mainPage == "pool") {
          this.router.navigate(["/pool/view/", this.jwtHelper.decodeToken(data.token)._doc.mainPool]);
        } else {
          this.router.navigate(["/"]);
        }
      }
      else {
        console.log("No success detected");
      }
    } catch(e) {
      console.log(e);
    }

  }

}
