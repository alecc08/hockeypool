import { Component, Injectable } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  template: `
  <div class="container-fluid" [@fade]>
    <div class="alert alert-success bigshadow" *ngIf="messageOfTheDay && messageOfTheDay.message.length > 0">
      <h4 class="alert-heading">Message of the day</h4>
      <p>{{messageOfTheDay.message}}</p>
    </div>
    <div class="card">
      <div class="card-header">
        <h3>Top Players</h3>
      </div>
      <div class="row">
        <div class="col-xl-6 col-lg-12" style="text-align:center">
          <div class="card">
            <div class="card-text">
                <h4>Skaters</h4>
                <table class="table">
                  <thead>
                    <th>Name</th>
                    <th>Team</th>
                    <th>Goals</th>
                    <th>Assists</th>
                    <th>Points</th>
                    <th>GWG</th>
                    <th>OTG</th>
                  </thead>
                  <tbody>
                    <tr *ngFor="let skater of topSkaters">
                      <td><a [routerLink]="['/player', skater.name]">{{skater.name}} <span *ngIf="skater.injury && skater.injury.length > 0" class="badge badge-pill badge-default" title="{{skater.injury}}"><i class="fa fa-wheelchair"></i></span></a></td>
                      <td><img class="logo" [src]="getTeamLogo(skater.team)" /></td>
                      <td>{{skater.goals}}</td>
                      <td>{{skater.assists}}</td>
                      <td>{{skater.points}}</td>
                      <td>{{skater.gwg}}</td>
                      <td>{{skater.otg}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-12" style="text-align:center">
          <div class="card">
            <div class="card-text">
            <h4>Goalies</h4>
            <table class="table">
              <thead>
                <th>Name</th>
                <th>Team</th>
                <th>Wins</th>
                <th>OTL</th>
                <th>SO</th>
                <th>GAA</th>
                <th>SV%</th>
              </thead>
              <tbody>
                <tr *ngFor="let goalie of topGoalies">
                  <td><a [routerLink]="['/player', goalie.name]">{{goalie.name}} <span *ngIf="goalie.injury && goalie.injury.length > 0" class="badge badge-pill badge-default" title="{{goalie.injury}}"><i class="fa fa-wheelchair"></i></span></a></td>
                  <td><img class="logo" [src]="getTeamLogo(goalie.team)" /></td>
                  <td>{{goalie.wins}}</td>
                  <td>{{goalie.otl}}</td>
                  <td>{{goalie.shutouts}}</td>
                  <td>{{goalie.gaa}}</td>
                  <td>{{goalie.savePercent}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
export class HomeComponent {
  topSkaters;
  topGoalies;
  messageOfTheDay;

  constructor(private http:AuthHttp) {
    http.get("/api/players?type=Skater&limit=5").map(res => res.json()).subscribe(players => {this.topSkaters = players}, error => console.log(error));
    http.get("/api/players?type=Goalie&sort=wins&limit=5").map(res => res.json()).subscribe(players => {this.topGoalies = players}, error => console.log(error));
    http.get("/api/websiteMessage").map(res => res.json()).subscribe(messageOfTheDay => {this.messageOfTheDay = messageOfTheDay}, error => console.log(error));
  }

  getTeamLogo(team) {
    return `/images/teams/${team}.gif`;
  }
}
