import { Component, Injectable, OnInit } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthHttp, JwtHelper } from 'angular2-jwt';
@Component({
  template: `
  <a class="btn btn-sm btn-primary" role="button" *ngIf="pool" [routerLink]="['/pool/view/',pool._id]"><i class="fa fa-1 fa-arrow-left"></i> Back to {{pool.name}}</a>
  <div class="card">
    <div class="card-header">
      <h3>{{participantTeamName}}</h3>
      <h4 style="float:right" *ngIf="poolAccount && poolAccount.account">Owner: {{poolAccount.account.name}}</h4>
      <button class="btn btn-primary" *ngIf="isAdmin()" (click)="isEditing = !isEditing"><i class="fa fa-edit"></i> Edit Account</button>
      <button [@fade] class="btn btn-success" *ngIf="isEditing" (click)="isAdding = !isAdding"><i class="fa fa-user-plus"></i> Add Player</button>
      <div [@fade] *ngIf="isEditing && isAdding">
        <form class="form-inline">
          <input class="form-control" type="text" name="playerName" [(ngModel)]="playerName" placeholder="Player name"/><button class="btn btn-secondary" (click)="addPlayer()"><i class="fa fa-plus-square"></i> Add</button>
          <div class="alert alert-success" *ngIf="playerAddSuccess">{{playerAddSuccess}}</div>
          <div class="alert alert-danger" *ngIf="playerAddFail">{{playerAddFail}}</div>
        </form>
      </div>
    </div>
    <div class="card-block">
      <h4>Skaters</h4>
      <table class="table table-hover shadow">
        <thead>
          <th>Name</th>
          <th>Team</th>
          <th>Goals<sup>{{pool.pointsPerGoal}}</sup></th>
          <th>Assists<sup>{{pool.pointsPerAssist}}</sup></th>
          <th>Points</th>
          <th>GWG<sup>{{pool.pointsPerGWG}}</sup></th>
          <th>OTG<sup>{{pool.pointsPerOTG}}</sup></th>
          <th>Pool Points</th>
          <th *ngIf="isEditing"></th>
        </thead>
        <tbody>
          <tr [ngClass]="{'inactive': skater.active === false}" [@fade] *ngFor="let skater of skaters" style="cursor:pointer">
            <td (click)="openPlayerView(skater)">{{skater.name}} <span *ngIf="skater.injury && skater.injury.length > 0" class="badge badge-pill badge-default" title="{{skater.injury}}"><i class="fa fa-wheelchair"></i></span></td>
            <td><img class="logo" [src]="getTeamLogo(skater.team)" /></td>
            <td>{{skater.goals}}</td>
            <td>{{skater.assists}}</td>
            <td>{{skater.points}}</td>
            <td>{{skater.gwg}}</td>
            <td>{{skater.otg}}</td>
            <td>{{skater.poolPoints}}</td>
            <td style="width:50px" *ngIf="isEditing"><button [@fade] class="btn btn-danger btn-sm" (click)="removePlayer(skater)"><i class="fa fa-trash-o"></i></button></td>
          </tr>
        </tbody>
      </table>
      <h4>Goalies</h4>
      <table class="table table-hover">
        <thead>
          <th>Name</th>
          <th>Team</th>
          <th>Wins<sup>{{pool.pointsPerGoalieWin}}</sup></th>
          <th>Losses</th>
          <th>Shutouts<sup>{{pool.pointsPerGoalieShutout}}</sup></th>
          <th>OTL<sup>{{pool.pointsPerGoalieOtl}}</sup></th>
          <th>Goals<sup>{{pool.pointsPerGoalieGoal}}</sup></th>
          <th>Assists<sup>{{pool.pointsPerGoalieAssist}}</sup></th>
          <th>Pool Points</th>
          <th *ngIf="isEditing"></th>
        </thead>
        <tbody>
          <tr [ngClass]="{'inactive': goalie.active === false}" [@fade] *ngFor="let goalie of goalies"  style="cursor:pointer">
            <td (click)="openPlayerView(goalie)">{{goalie.name}}  <span *ngIf="goalie.injury && goalie.injury.length > 0" title="{{goalie.injury}}" class="badge badge-pill badge-default"><i class="fa fa-wheelchair"></i></span></td>
            <td><img class="logo" [src]="getTeamLogo(goalie.team)" /></td>
            <td>{{goalie.wins}}</td>
            <td>{{goalie.losses}}</td>
            <td>{{goalie.shutouts}}</td>
            <td>{{goalie.otl}}</td>
            <td>{{goalie.goals}}</td>
            <td>{{goalie.assists}}</td>
            <td>{{goalie.poolPoints}}</td>
            <td style="width:50px" *ngIf="isEditing"><button [@fade] class="btn btn-sm btn-danger" (click)="removePlayer(goalie)"><i class="fa fa-trash-o"></i></button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `,
  animations: [
  trigger('shrink', [
    transition('* => void', [
      style({height: '*'}),
      animate('250ms ease-in', style({height: 0}))
    ]),
    transition('void => *', [
      style({height: '0'}),
      animate('250ms ease-out', style({height: '*'}))
    ]),
  ]),
  trigger('fade', [
    transition('void => *', [
      style({opacity: 0}),
      animate('200ms ease-in', style({opacity: 1}))
    ])
  ])
]
})
@Injectable()
export class PoolAccountViewComponent implements OnInit {

  sub;
  pool:any = {};
  poolAccount:any = {};
  skaters = [];
  goalies = [];

  playerAddSuccess:string;
  playerAddFail:string;

  userId = 0;
  jwtHelper: JwtHelper = new JwtHelper();


  isAdding:Boolean = false;
  isEditing:Boolean = false;

  participantTeamName:string = "Loading...";
  playerName;

  constructor(private route:ActivatedRoute, private http:AuthHttp, private router:Router) {
    this.userId = this.jwtHelper.decodeToken(localStorage.getItem('id_token'))._doc._id;
  }

  isAdmin() {
    return this.pool && this.userId == this.pool.owner;
  }

  getTeamLogo(team) {
    return `/images/teams/${team}.gif`;
  }

  ngOnInit(){
    this.sub = this.route.params.subscribe(params => {
      let url = "/api/pool/" + params['id'] + "/poolAccount/" + params['accountId'];
      this.http.get(url).map(res => res.json())
        .subscribe(pool => {this.initPoolAccount(pool)},
                  error => console.log(error));
    });
  }

  initPoolAccount(poolRes) {
    if(poolRes) {
      this.pool = poolRes.pool;
      this.poolAccount = poolRes.poolAccount;
    }

    this.skaters = [];
    this.goalies = [];

    this.participantTeamName = this.poolAccount.teamName;

    if(this.pool && this.poolAccount) {
      let ctx = this;
      this.poolAccount.players.forEach(function(player) {
        if(player.position != 'Goalie') {
          ctx.skaters.push({name: player.name, team: player.team, goals: player.goals,
            assists: player.assists, points: player.points,
            gwg: player.gwg, otg: player.otg, poolPoints: ctx.calculateTotalPoints(player), injury: player.injury, active:player.active});
        } else {
          ctx.goalies.push({name: player.name, team: player.team, wins: player.wins, losses: player.losses, goals: player.goals, assists: player.assists,
            otl: player.otl, shutouts: player.shutouts, active: player.active,
            poolPoints: ctx.calculateTotalPoints(player), injury: player.injury});
        }
      });
      this.skaters.sort(function(a,b) {
        return b.poolPoints - a.poolPoints;
      });
      this.goalies.sort(function(a,b) {
        return b.poolPoints - a.poolPoints;
      });
    }
  }

  addPlayer() {
    this.http.post('/api/pool/' + this.pool._id + '/poolAccount/' + this.poolAccount._id + '/player/' + this.playerName, {})
      .map(res => res.json())
      .subscribe(response => {this.processAddPlayerResponse(response)},
                error => console.log(error));
  }

  removePlayer(player) {
    this.http.delete('/api/pool/' + this.pool._id + '/poolAccount/' + this.poolAccount._id + '/player/' + player.name, {})
      .map(res => res.json())
      .subscribe(response => {this.processRemovePlayerResponse(response)},
                error => console.log(error));
  }

  processAddPlayerResponse(response) {
    this.playerName = "";
    if(response.success && response.player) {
      this.playerAddFail = null;
      this.playerAddSuccess = "Sucessfully added.";
      this.poolAccount.players.push(response.player);
      this.initPoolAccount(null);
    }
    else {
      this.playerAddFail = "Failed to add player";
      this.playerAddSuccess = null;
    }
  }

  processRemovePlayerResponse(response) {
    if(response.success && response.player) {
      let index=-1;
      for(let i=0;i<this.poolAccount.players.length;i++) {
        if(this.poolAccount.players[i].name == response.player.name) {
          index = i;
          break;
        }
      }
      if(index >= 0) {
        this.poolAccount.players.splice(index,1);
        this.initPoolAccount(null);
      }

    }
  }

  openPlayerView(player) {
    this.router.navigate(['/player/',player.name]);
  }

  calculateTotalPoints(player) {
    let totalPoints = 0;
    if(player.position != 'Goalie') {
      totalPoints += (this.pool.pointsPerGoal * player.goals);
      totalPoints += (this.pool.pointsPerAssist * player.assists);
      totalPoints += (this.pool.pointsPerGWG * player.gwg);
      totalPoints += (this.pool.pointsPerOTG * player.otg);
    } else {
      totalPoints += (this.pool.pointsPerGoalieWin * player.wins);
      totalPoints += (this.pool.pointsPerGoalieShutout * player.shutouts);
      totalPoints += (this.pool.pointsPerGoalieOtl * player.otl);
      totalPoints += (this.pool.pointsPerGoalieGoal * player.goals);
      totalPoints += (this.pool.pointsPerGoalieAssist * player.assists);
    }
    return totalPoints;
  }
}
