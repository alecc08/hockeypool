import { Component, Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
@Component({
  template: `
  <div [@fade]>
    <div *ngIf="invites && invites.length > 0">
      <div class="card-header">
        <h3>Invites</h3>
      </div>
      <div class="card">
        <div class="card-block">
        <span class="alert alert-danger" role="alert" *ngIf="error">{{error}}</span>
        <ul class="list-group shadow">
          <li class="list-group-item" *ngFor="let invite of invites">
            <h5>{{invite.pool.name}}</h5>
            <button (click)="acceptInvite(invite._id)" class="btn btn-success btn-sm"><i class="fa fa-check-circle"></i> Accept</button>
            <button (click)="rejectInvite(invite._id)" class="btn btn-danger btn-sm"><i class="fa fa-ban"></i> Reject</button>
          </li>
        </ul>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h3>My Pools</h3>
      </div>
      <div class="card-block">
        <span class="alert alert-danger" role="alert" *ngIf="error">{{error}}</span>
        <h4>Click on a pool to view it or create a new one</h4>
        <ul class="list-group shadow">
          <button [@fade]="pool" class="btn btn-secondary btn-block btn-lg" style="cursor:pointer"  *ngFor="let pool of pools" (click)="openPool(pool._id)">
            {{pool.name}}
          </button>
        </ul>
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
export class MyPoolsComponent {

  poolUrl:string = "/api/pool";
  inviteUrl:string = "/api/invite";
  pools;
  invites;
  error;

  constructor(private http:AuthHttp, private router:Router) {
    this.http.get(this.poolUrl)
      .subscribe(//call the post
        data => this.handleResponse(data.text()), // put the data returned from the server in our variable
        error => {}, // in case of failure show this message
        () => {}//run this code in all cases
    );
    this.http.get(this.inviteUrl)
      .subscribe(//call the post
        data => this.handleInviteResponse(data.text()), // put the data returned from the server in our variable
        error => {}, // in case of failure show this message
        () => {} //run this code in all cases
    );
  }

  openPool(id) {
    this.router.navigate(['/pool/view/', id]);
  }

  rejectInvite(id) {
    this.http.delete(this.inviteUrl + '/' + id)
      .subscribe(//call the post
        data => this.handleInviteRejectResponse(data), // put the data returned from the server in our variable
        error => {}, // in case of failure show this message
        () => {}//run this code in all cases
    );
  }

  acceptInvite(id) {
    this.http.get(this.inviteUrl + '/' + id + '/accept')
      .subscribe(//call the post
        data => this.handleInviteAcceptResponse(data), // put the data returned from the server in our variable
        error => {}, // in case of failure show this message
        () => {} //run this code in all cases
    );
  }

  handleResponse(data) {
    try {
      data = JSON.parse(data);
      if(data.success) {
        this.pools = data.pools;
        this.error = null;
      } else {
        this.error = data.message;
      }

    } catch(e) {
      console.log(e);
    }

  }

  handleInviteRejectResponse(data) {
    data = JSON.parse(data._body);
    if(data.success) {
      for(let i=0;i<this.invites.length;i++) {
        if(this.invites[i]._id == data.inviteId) {
          this.invites.splice(i,1);
        }
      }
    }
  }

  handleInviteAcceptResponse(data) {
    data = JSON.parse(data._body);
    if(data.success) {
      for(let i=0;i<this.invites.length;i++) {
        if(this.invites[i]._id == data.inviteId) {
          this.invites.splice(i,1);
        }
      }
      this.pools.push(data.pool);
    }
  }

  handleInviteResponse(data) {
    try {
      data = JSON.parse(data);
      if(data.success) {
        this.invites = data.invites;
        this.error = null;
      }

    } catch(e) {
      console.log(e);
    }

  }


}
