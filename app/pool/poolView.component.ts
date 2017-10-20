import { Component, Injectable, OnInit, ViewChild, ElementRef } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Headers, RequestOptions, Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthHttp, JwtHelper } from 'angular2-jwt';
import { PoolService } from '../service/pool.service';
import { Observable } from 'rxjs/Observable';
@Component({
  template: `


  <div class="card">
    <div class="card-header">
      <h3>{{pool.name}}</h3>
      <h4 style="float:right" *ngIf="pool && pool.owner">Pool Manager: {{pool.owner.name}}</h4>
      <button (click)="inviteOpen = !inviteOpen" class="btn btn-primary" *ngIf="pool"><i class="fa fa-envelope-open-o" aria-hidden="true"></i> Invite</button>
      <button (click)="editMode = !editMode" class="btn btn-warning" *ngIf="pool && isOwner"><i class="fa fa-edit" aria-hidden="true"></i> Edit</button>
      <button [@fade] [@shrink] (click)="deletePool()" class="btn btn-danger" *ngIf="editMode"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete Pool</button>
      <div [@shrink] *ngIf="inviteOpen">
        <form class="form-inline">
          <input class="form-control" type="text" name="inviteEmail" [(ngModel)]="inviteEmail" placeholder="example@email.com"/><button class="btn btn-secondary" (click)="sendInvite()">Send</button>
          <span *ngIf="inviteResponse">{{inviteResponse}}</span>
        </form>
      </div>
    </div>
    <div class="card-block">
      <table class="table table-hover shadow">
        <tr>
          <th>Position</th>
          <th>Team name</th>
          <th></th>
          <th>Points</th>
          <th>Behind Next</th>
          <th>Behind First</th>
          <td style="width:50px" *ngIf="editMode"></td>
        </tr>
        <tr [@fade] *ngFor="let row of rows" style="cursor:pointer">
          <td>{{row.rank}}</td>
          <td *ngIf="!editMode || !row.isEditing" (click)="openPoolAccount(row.id)">{{row.teamName}} </td>
          <td *ngIf="editMode && row.isEditing"><form class="form-inline"><input class="form-control" name="teamName" [(ngModel)]="row.teamName" type="text" /> </form></td>
          <td>
              <button [@fade] *ngIf="editMode && !row.isEditing" style="float:right" class="btn btn-warning btn-sm"  (click)="row.isEditing=!row.isEditing"><i class="fa fa-edit" style="color:black;"></i></button>
              <button [@fade] *ngIf="editMode && row.isEditing" style="float:right" (click)="saveTeam(row)" class="btn btn-success btn-sm"><i class="fa fa-check-circle" style="color:white;"></i></button>
          </td>
          <td>{{row.points}}</td>
          <td>{{row.behindNext}}</td>
          <td>{{row.behindFirst}}</td>
          <td style="width:50px" *ngIf="editMode"><button [@fade] [@shrink] class="btn btn-danger btn-sm" (click)="removePoolAccount(row)" ><i class="fa fa-trash-o"></i></button></td>
        </tr>
      </table>
    </div>
  </div>
  <div #chat [@fade] [@slim]="chatHidden" class="card bigshadow" style="height:540px; width: 350px; border: solid 2px #0275d8;position: fixed; bottom: 0; right: 10px; max-width:80%; max-height:95%;">
    <div style="position:relative; height:100%;width:100%">
      <div style="position:relative; left: -60px; height:35px;">
        <button class="btn btn-primary btn-sm" (click)="chatHidden = chatHidden == 'false' ? 'true' : 'false'"><i class="" [ngClass]="chatHidden == 'false' ? 'fa fa-arrow-right' : 'fa fa-arrow-left'"></i> Chat</button>
      </div>
      <div #chatWindow style="height: 480px;padding: 5px; overflow:auto; word-wrap: break-word;">
        <div class="shadow" *ngFor="let message of messages">
          <b>{{message.posterName}}</b>: {{message.message}}
        </div>
        <div #endChat></div>
      </div>
      <div style="width:345px;position:fixed; bottom: 2px" class="input-group">
        <input type="text" class="form-control form-control-sm" placeholder="Type here..." [(ngModel)]="chatText" (keyup.enter)="addText()">
      </div>
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
  ]),
  trigger('slim', [
    state('true', style({
      right: '-350px'
    })),
    state('false',   style({
      right: '0'
    })),
    transition('true => false', animate('100ms ease-in')),
    transition('false => true', animate('100ms ease-out'))
  ])
]
})
@Injectable()
export class PoolViewComponent implements OnInit {

  sub;
  pool:any = {};
  rows = [];
  userId = 0;
  isOwner = false;
  jwtHelper: JwtHelper = new JwtHelper();

  @ViewChild('chat') chat:ElementRef;
  @ViewChild('endChat') endChat:ElementRef;
  @ViewChild('chatWindow') chatWindow:ElementRef;

  chatText;

  inviteOpen:Boolean = false;
  editMode:Boolean = false;

  messages = [];

  inviteEmail:string;
  inviteResponse:string;

  chatHidden = "true";



  constructor(private route:ActivatedRoute, private http:AuthHttp, private router:Router, private poolService:PoolService) {
    this.userId = this.jwtHelper.decodeToken(localStorage.getItem('id_token'))._doc._id;
  }

  ngOnInit(){
    this.sub = this.route.params.subscribe(params => {
      let url = "/api/pool/" + params['id'];
      this.http.get(url).map(res => res.json()).subscribe(pool => {this.initPool(pool);}, error => console.log(error));
      this.http.get('/api/pool/'+ params['id'] + '/messages').map(res=>res.json()).subscribe(messages => {this.messages = messages;this.scrollDown();}, error => console.log(error));
    });


  }

  scrollDown() {
    let vm = this;
    setTimeout(function() {
      vm.chatWindow.nativeElement.scrollTop = vm.chatWindow.nativeElement.scrollHeight;
    }, 100);
  }

  addText() {
    if(this.chatText && this.chatText.length > 0) {
      this.messages.push({posterName:this.jwtHelper.decodeToken(localStorage.getItem('id_token'))._doc.name, message:this.chatText});

      this.http.post('/api/messages', {message: this.chatText, poolId:this.pool._id}).map(res =>res.json()).subscribe(res => console.log(res), error => console.log(error));
      this.chatText = "";
      this.scrollDown();
    }
  }



  saveTeam(row) {
    row.isEditing = false;
    this.poolService.saveTeamName(this.pool._id, row.id, row.teamName);
  }

  initPool(poolRes) {
    this.pool = poolRes;
    this.isOwner = (this.userId == poolRes.owner._id);
    if(this.pool && this.pool.participants) {
      let ctx = this;
      this.pool.participants.forEach(function(participant) {
        ctx.rows.push({id: participant._id, teamName: participant.teamName, points: ctx.calculateTotalPoints(participant.players)})
      });
      this.rows.sort(function(a,b) {
        return b.points - a.points;
      });
      var highestPoints = this.rows[0].points;
      var prevPoints = this.rows[0].points;
      var currentRank = 1;
      this.rows.forEach(function(row) {

        row.rank = currentRank++;
        row.behindNext = prevPoints - row.points;
        row.behindFirst = highestPoints - row.points;

        prevPoints = row.points;
      });
    }
  }

  openPoolAccount(id) {
    this.router.navigate(['/pool/view/', this.pool._id, 'account', id]);
  }

  calculateTotalPoints(players) {
    let totalPoints = 0;
    let ctx = this;
    players.forEach(function(player) {
      if(player.position != 'Goalie') {
        try {
          totalPoints += (ctx.pool.pointsPerGoal * player.goals);
          totalPoints += (ctx.pool.pointsPerAssist * player.assists);
          totalPoints += (ctx.pool.pointsPerGWG * player.gwg);
          totalPoints += (ctx.pool.pointsPerOTG * player.otg);

        } catch(e) {
          console.log("Failed to calculate points for " + player.name);
        }
      } else {
        try {
          totalPoints += (ctx.pool.pointsPerGoalieWin * player.wins);
          totalPoints += (ctx.pool.pointsPerGoalieShutout * player.shutouts);
          totalPoints += (ctx.pool.pointsPerGoalieOtl * player.otl);
          totalPoints += (ctx.pool.pointsPerGoalieGoal * player.goals);
          totalPoints += (ctx.pool.pointsPerGoalieAssist * player.assists);
        } catch(e) {
          console.log("Failed to calculate points for " + player.name);
        }
      }
    });
    return totalPoints;
  }

  deletePool() {
    var deletePool = confirm("Are you sure you want to delete the pool? This can't be undone.");
    if(deletePool) {
      console.log("Deleting pool " + this.pool._id);
      this.http.delete("/api/pool/" + this.pool._id).map(res => res.json())
      .subscribe(response => {
        if(response.success) {
          this.router.navigate(["pool","view"]);
        }
      });
    }
  }

  removePoolAccount(row) {
    let ctx = this;
    this.http.delete('/api/pool/' + this.pool._id + '/poolAccount/' + row.id).map(res => res.json())
      .subscribe(response => {
        if(response.success) {
          for(let i=0;i<ctx.rows.length;i++) {
            if(ctx.rows[i].id == row.id) {
              ctx.rows.splice(i,1);
              break;
            }
          }
        }
      }, error => console.log(error))
  }

  sendInvite() {

    console.log("Email:" + this.inviteEmail + " poolId: " + this.pool._id);
    this.http.post('/api/invite', {inviteEmail:this.inviteEmail, poolId: this.pool._id})
      .map(res => res.json()).subscribe(msg => {
        this.inviteResponse = msg.message; this.inviteEmail = ""}, error => {console.log(error)});
  }


}
