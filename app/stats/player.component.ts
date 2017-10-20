import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Injectable }     from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { ActivatedRoute } from '@angular/router';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  template: `


  <div class="card" [@fade]>
    <div class="card-header"><h1>Player Information</h1></div>
    <div class="card-block">
    <table *ngFor="let player of players" class="table table-striped">
    <tbody *ngIf="player.position!='Goalie'">
      <tr><td colspan="2"><img [src]="getTeamLogo(player.team)" /></td></tr>
      <tr><td>Name:</td><td> {{player.name}} </td></tr>
      <tr *ngIf="player.injury && player.injury.length > 0"> <td colspan="2"><div class="alert alert-danger"><span class="badge badge-pill badge-default"><i class="fa fa-wheelchair"></i></span> INJURED: {{player.injury}}</div></td></tr>
      <tr><td>Position:</td><td>  {{player.position}}</td></tr>
      <tr><td>Team:</td><td>  {{player.team}} </td></tr>
      <tr><td>Games Played:</td><td>  {{player.gamesPlayed}}</td></tr>
      <tr><td>Goals:</td><td>  {{player.goals}}</td></tr>
      <tr><td>Assists:</td><td>  {{player.assists}}</td></tr>
      <tr><td>Points:</td><td>  {{player.points}}</td></tr>
      <tr><td>+/-:</td><td>  {{player.pm}}</td></tr>
      <tr><td>Game winning goals:</td><td>  {{player.gwg}}</td></tr>
      <tr><td>Overtime Goals:</td><td>  {{player.otg}}</td></tr>
      <tr><td>Penalty in minutes:</td><td>  {{player.pim}}</td></tr>
      <tr><td>Shots:</td><td>  {{player.shots}}</td></tr>
      <tr><td>Powerplay Goals:</td><td>  {{player.ppg}}</td></tr>
      <tr><td>Powerplay Points:</td><td>  {{player.ppp}}</td></tr>
      <tr><td>Shorthanded goals:</td><td>  {{player.shg}}</td></tr>
      <tr><td>Shorthanded points:</td><td>  {{player.shp}}</td></tr>
      <tr><td>Stats Updated:</td><td>  {{player.lastUpdated}} </td></tr>
      </tbody>

      <tbody *ngIf="player.position==='Goalie'">
        <tr><td colspan="2"><img *ngIf="player" [src]="getTeamLogo(player.team)" /></td></tr>
        <tr><td>Name:</td><td> {{player.name}} </td></tr>
        <tr *ngIf="player.injury && player.injury.length > 0"> <td colspan="2"><div class="alert alert-danger"><span class="badge badge-pill badge-default"><i class="fa fa-wheelchair"></i></span>INJURED: {{player.injury}}</div></td></tr>
        <tr><td>Position:</td><td>  {{player.position}}</td></tr>
        <tr><td>Team:</td><td>  {{player.team}} </td></tr>
        <tr><td>Games Played:</td><td>  {{player.gamesPlayed}}</td></tr>
        <tr><td>Wins:</td><td>  {{player.wins}}</td></tr>
        <tr><td>Losses:</td><td>  {{player.losses}}</td></tr>
        <tr><td>Overtime losses:</td><td>  {{player.otl}}</td></tr>
        <tr><td>Shutouts:</td><td>  {{player.shutouts}}</td></tr>
        <tr><td>Shots Against:</td><td>  {{player.shotsAgainst}}</td></tr>
        <tr><td>Goals Against:</td><td>  {{player.goalsAgainst}}</td></tr>
        <tr><td>GAA:</td><td>  {{player.gaa}}</td></tr>
        <tr><td>Saves:</td><td>  {{player.saves}}</td></tr>
        <tr><td>Save %:</td><td>  {{player.savePercent}}</td></tr>
        <tr><td>Goals:</td><td>  {{player.goals}}</td></tr>
        <tr><td>Assists:</td><td>  {{player.assists}}</td></tr>

        <tr><td>Stats Updated:</td><td>  {{player.lastUpdated}} </td></tr>
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
export class PlayerComponent implements OnInit {

  private players = [{}];
  sub:any;

  constructor(private http:AuthHttp, private route: ActivatedRoute) {

  }

  getTeamLogo(team) {
    return `/images/teams/${team}.gif`;
  }

  ngOnInit(){
    this.sub = this.route.params.subscribe(params => {
      let url = "/api/players/" + params['name'];
      this.http.get(url).map(res => res.json()).subscribe(player => {this.players = player;}, error => console.log(error));
    });
  }
}
