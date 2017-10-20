import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate() {
    if(!tokenNotExpired()) {
      this.router.navigate(["unauthorized"]);
      return false;
    }
    return true;
  }
}
