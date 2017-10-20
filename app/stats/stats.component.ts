import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Injectable }     from '@angular/core';
import { Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
@Component({
  template: `

  <div class="card" [@fade]>
    <div class="card-header"><h3>All Player Stats</h3></div>
    <select class="custom-select" id="inlineFormCustomSelect" (change)="refreshWithFilter()">
      <option selected>Team</option>
      <option value="canadiens">Canadiens</option>
      <option value="2">Two</option>
      <option value="3">Three</option>
    </select>
    <select class="custom-select" id="inlineFormCustomSelect2">
      <option selected>Max Results</option>
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="50">50</option>
      <option value="100">100</option>
      <option value="500">500</option>
    </select>
    <div class="card-block">
      <table class="table shadow"> <!--Players -->
        <thead>
          <tr>
            <th>Name</th>
            <th>Team</th>
            <th>Pos</th>
            <th>GP</th>
            <th>G</th>
            <th>A</th>
            <th>P</th>
            <th>+/-</th>
            <th>GWG</th>
            <th>OTG</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let player of players">
            <td><i *ngIf="players.length == 1" class="fa fa-refresh fa-spin fa-3x fa-fw"></i><a [routerLink]="['/player', player.name]">{{player.name}} <span *ngIf="player.injury && player.injury.length > 0" class="badge badge-pill badge-default" title="{{player.injury}}"><i class="fa fa-wheelchair"></i></span></a></td>
            <td><img *ngIf="players.length > 1" class="logo" [src]="getTeamLogo(player.team)" /></td>
            <td>{{player.position}}</td>
            <td>{{player.gp}}</td>
            <td>{{player.goals}}</td>
            <td>{{player.assists}}</td>
            <td>{{player.points}}</td>
            <td>{{player.pm}}</td>
            <td>{{player.gwg}}</td>
            <td>{{player.otg}}</td>
          </tr>
        </tbody>
      </table>
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
export class StatsComponent {

  private players = [ {name:"Loading..."} ];

  constructor(private http:AuthHttp) {
    http.get("/api/players").map(res => res.json()).subscribe(players => {this.players = players}, error => console.log(error));
  }

  getTeamLogo(team) {
    return `/images/teams/${team}.gif`;
  }

  refreshWithFilter() {
    this.http.get("/api/players?team=canadiens&limit=50").map(res => res.json()).subscribe(players => {this.players = players}, error => console.log(error));
  }
}
