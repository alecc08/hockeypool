import { Component, Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { AuthHttp, JwtHelper } from 'angular2-jwt';
@Component({
  template: ``
})
@Injectable()
export class MainComponent {

  jwtHelper:JwtHelper = new JwtHelper();

  constructor(private http:AuthHttp, private router:Router) {

    if(this.jwtHelper.decodeToken(localStorage.getItem('id_token'))._doc.mainPage == "pool") {
      this.router.navigate(['/pool/view/', this.jwtHelper.decodeToken(localStorage.getItem('id_token'))._doc.mainPool]);
    } else {
      this.router.navigate(['/home']);
    }
  }



}
