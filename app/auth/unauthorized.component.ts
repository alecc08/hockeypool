import { Component } from '@angular/core';
@Component({
  template: `

  <h3 class="danger">Login</h3>
  <div class="card">
    <div class="card-block">
      <p class="card-text">You need to login to view this page.</p>
      <a routerLink="/register" class="btn btn-primary">Create Account</a>
    </div>
  </div>
  `
})
export class UnauthorizedComponent {

}
