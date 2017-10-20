import { Component, Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthHttp } from 'angular2-jwt';
@Component({
  template: `


  <div class="card" [@fade]>
    <div class="card-header">
      <h3>Create Pool</h3>
    </div>
    <div class="card-block">
      <form>
        <div class="form-group row">
          <label for="inputName" class="col-sm-2 col-form-label">Pool Name</label>
          <div class="col-sm-10">
            <input type="text" [(ngModel)]="inputName" class="form-control" name="inputName" id="inputName" placeholder="Pool Name">
          </div>
        </div>
        <div class="form-group row">
          <label for="inputNumSkaters" class="col-sm-2 col-form-label"># of skaters</label>
          <div class="col-sm-10">
            <input type="text" [(ngModel)]="inputNumSkaters" class="form-control" name="inputNumSkaters" id="inputNumSkaters" placeholder="10">
          </div>
        </div>
        <div class="form-group row">
          <label for="inputNumGoalies" class="col-sm-2 col-form-label"># of goalies</label>
          <div class="col-sm-10">
            <input type="text" [(ngModel)]="inputNumGoalies" class="form-control" name="inputNumGoalies" id="inputNumGoalies" placeholder="1">
          </div>
        </div>
        <div class="form-group row">
          <label for="pointsPerGoal" class="col-sm-2 col-form-label">Points per goal</label>
          <div class="col-sm-10">
            <input type="text" [(ngModel)]="pointsPerGoal" class="form-control" name="pointsPerGoal" id="pointsPerGoal" placeholder="1">
          </div>
        </div>
        <div class="form-group row">
          <label for="pointsPerAssist" class="col-sm-2 col-form-label">Points per assist</label>
          <div class="col-sm-10">
            <input type="text" [(ngModel)]="pointsPerAssist" class="form-control" name="pointsPerAssist" id="pointsPerAssist" placeholder="1">
          </div>
        </div>
        <div class="form-group row">
          <label for="pointsPerGWG" class="col-sm-2 col-form-label">Points per game winning goal</label>
          <div class="col-sm-10">
            <input type="text" [(ngModel)]="pointsPerGWG" class="form-control" name="pointsPerGWG" id="pointsPerGWG" placeholder="1">
          </div>
        </div>
        <div class="form-group row">
          <label for="pointsPerOTG" class="col-sm-2 col-form-label">Points per overtime goal</label>
          <div class="col-sm-10">
            <input type="text" [(ngModel)]="pointsPerOTG" class="form-control" name="pointsPerOTG" id="pointsPerOTG" placeholder="1">
          </div>
        </div>
        <div class="form-group row">
          <label for="pointsPerGoalieWin" class="col-sm-2 col-form-label">Points per goalie win</label>
          <div class="col-sm-10">
            <input type="text" [(ngModel)]="pointsPerGoalieWin" class="form-control" name="pointsPerGoalieWin" id="pointsPerGoalieWin" placeholder="1">
          </div>
        </div>
        <div class="form-group row">
          <label for="pointsPerGoalieGoal" class="col-sm-2 col-form-label">Points per goalie goal</label>
          <div class="col-sm-10">
            <input type="text" [(ngModel)]="pointsPerGoalieGoal" class="form-control" name="pointsPerGoalieGoal" id="pointsPerGoalieGoal" placeholder="4">
          </div>
        </div>
        <div class="form-group row">
          <label for="pointsPerGoalieAssist" class="col-sm-2 col-form-label">Points per goalie assist</label>
          <div class="col-sm-10">
            <input type="text" [(ngModel)]="pointsPerGoalieAssist" class="form-control" name="pointsPerGoalieAssist" id="pointsPerGoalieAssist" placeholder="2">
          </div>
        </div>
        <div class="form-group row">
          <label for="pointsPerGoalieOtl" class="col-sm-2 col-form-label">Points per goalie overtime loss</label>
          <div class="col-sm-10">
            <input type="text" [(ngModel)]="pointsPerGoalieOtl" class="form-control" name="pointsPerGoalieOtl" id="pointsPerGoalieOtl" placeholder="1">
          </div>
        </div>
        <div class="form-group row">
          <label for="pointsPerGoalieShutout" class="col-sm-2 col-form-label">Points per goalie shutout</label>
          <div class="col-sm-10">
            <input type="text" [(ngModel)]="pointsPerGoalieShutout" class="form-control" name="pointsPerGoalieShutout" id="pointsPerGoalieOtl" placeholder="1">
          </div>
        </div>
        <div class="alert alert-danger" role="alert" *ngIf="errorMessage">{{errorMessage}}</div>
        <div class="alert alert-success" role="alert" *ngIf="successMessage">{{successMessage}}</div>
        <div class="form-group row">
          <div class="offset-sm-2 col-sm-10">
            <button (click)="createPool()" [disabled]="!isValid()" class="btn btn-primary">Create Pool</button>
          </div>

        </div>
      </form>
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
export class CreatePoolComponent {

  poolUrl:string = "/api/pool";

  errorMessage:String;
  successMessage:String;

  inputName:String;
  inputNumSkaters:String = "12";
  inputNumGoalies:String = "1";
  pointsPerGoal:String = "1";
  pointsPerAssist:String = "1";
  pointsPerGWG:String = "1";
  pointsPerOTG:String = "1";
  pointsPerGoalieWin:String = "2";
  pointsPerGoalieShutout:String = "1";
  pointsPerGoalieOtl:String = "1";
  pointsPerGoalieGoal:String = "4";
  pointsPerGoalieAssist:String = "2";

  setError(msg) {
    this.successMessage = null;
    this.errorMessage = msg;
  }

  setSuccess(msg) {
    this.successMessage = msg;
    this.errorMessage = null;
  }

  constructor(private http:AuthHttp) {
  }

  createPool() {
    let body = JSON.stringify(this.generatePoolInformation());
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers});

    return this.http.put(this.poolUrl, body,options)
            .subscribe(//call the post
                data => this.handleResponse(data.text()), // put the data returned from the server in our variable
                error => console.log("Error HTTP Post Service"), // in case of failure show this message
                () => console.log("Job Done Post !")//run this code in all cases
            );
  }

  generatePoolInformation() {
    var pool:any = {};
    pool.name = this.inputName;
    pool.pointsPerGoal = this.pointsPerGoal;
    pool.pointsPerAssist = this.pointsPerAssist;
    pool.pointsPerGWG = this.pointsPerGWG;
    pool.pointsPerOTG = this.pointsPerOTG;
    pool.pointsPerGoalieWin = this.pointsPerGoalieWin;
    pool.pointsPerGoalieShutout = this.pointsPerGoalieShutout;
    pool.pointsPerGoalieOtl = this.pointsPerGoalieOtl;
    pool.pointsPerGoalieGoal = this.pointsPerGoalieGoal;
    pool.pointsPerGoalieAssist = this.pointsPerGoalieAssist;
    pool.numSkaters = this.inputNumSkaters;
    pool.numGoalies = this.inputNumGoalies;
    return pool;
  }

  handleResponse(data) {
    try {
      console.log(data);
      data = JSON.parse(data);
      if(data && data.success) {
        this.setSuccess(data.message);
      }
      else {
        this.setError(data.message);
      }
    } catch(e) {
      console.log(e);
    }

  }

  isValid() {
    let ok = true;
    ok = ok && (this.inputName && this.inputName.length > 1);

    return ok;
  }
}
