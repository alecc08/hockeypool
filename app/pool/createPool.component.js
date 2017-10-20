"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var animations_1 = require("@angular/animations");
var angular2_jwt_1 = require("angular2-jwt");
var CreatePoolComponent = (function () {
    function CreatePoolComponent(http) {
        this.http = http;
        this.poolUrl = "/api/pool";
        this.inputNumSkaters = "12";
        this.inputNumGoalies = "1";
        this.pointsPerGoal = "1";
        this.pointsPerAssist = "1";
        this.pointsPerGWG = "1";
        this.pointsPerOTG = "1";
        this.pointsPerGoalieWin = "2";
        this.pointsPerGoalieShutout = "1";
        this.pointsPerGoalieOtl = "1";
        this.pointsPerGoalieGoal = "4";
        this.pointsPerGoalieAssist = "2";
    }
    CreatePoolComponent.prototype.setError = function (msg) {
        this.successMessage = null;
        this.errorMessage = msg;
    };
    CreatePoolComponent.prototype.setSuccess = function (msg) {
        this.successMessage = msg;
        this.errorMessage = null;
    };
    CreatePoolComponent.prototype.createPool = function () {
        var _this = this;
        var body = JSON.stringify(this.generatePoolInformation());
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.put(this.poolUrl, body, options)
            .subscribe(//call the post
        function (//call the post
            data) { return _this.handleResponse(data.text()); }, // put the data returned from the server in our variable
        function (// put the data returned from the server in our variable
            error) { return console.log("Error HTTP Post Service"); }, // in case of failure show this message
        function () { return console.log("Job Done Post !"); } //run this code in all cases
        );
    };
    CreatePoolComponent.prototype.generatePoolInformation = function () {
        var pool = {};
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
    };
    CreatePoolComponent.prototype.handleResponse = function (data) {
        try {
            console.log(data);
            data = JSON.parse(data);
            if (data && data.success) {
                this.setSuccess(data.message);
            }
            else {
                this.setError(data.message);
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    CreatePoolComponent.prototype.isValid = function () {
        var ok = true;
        ok = ok && (this.inputName && this.inputName.length > 1);
        return ok;
    };
    return CreatePoolComponent;
}());
CreatePoolComponent = __decorate([
    core_1.Component({
        template: "\n\n\n  <div class=\"card\" [@fade]>\n    <div class=\"card-header\">\n      <h3>Create Pool</h3>\n    </div>\n    <div class=\"card-block\">\n      <form>\n        <div class=\"form-group row\">\n          <label for=\"inputName\" class=\"col-sm-2 col-form-label\">Pool Name</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" [(ngModel)]=\"inputName\" class=\"form-control\" name=\"inputName\" id=\"inputName\" placeholder=\"Pool Name\">\n          </div>\n        </div>\n        <div class=\"form-group row\">\n          <label for=\"inputNumSkaters\" class=\"col-sm-2 col-form-label\"># of skaters</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" [(ngModel)]=\"inputNumSkaters\" class=\"form-control\" name=\"inputNumSkaters\" id=\"inputNumSkaters\" placeholder=\"10\">\n          </div>\n        </div>\n        <div class=\"form-group row\">\n          <label for=\"inputNumGoalies\" class=\"col-sm-2 col-form-label\"># of goalies</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" [(ngModel)]=\"inputNumGoalies\" class=\"form-control\" name=\"inputNumGoalies\" id=\"inputNumGoalies\" placeholder=\"1\">\n          </div>\n        </div>\n        <div class=\"form-group row\">\n          <label for=\"pointsPerGoal\" class=\"col-sm-2 col-form-label\">Points per goal</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" [(ngModel)]=\"pointsPerGoal\" class=\"form-control\" name=\"pointsPerGoal\" id=\"pointsPerGoal\" placeholder=\"1\">\n          </div>\n        </div>\n        <div class=\"form-group row\">\n          <label for=\"pointsPerAssist\" class=\"col-sm-2 col-form-label\">Points per assist</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" [(ngModel)]=\"pointsPerAssist\" class=\"form-control\" name=\"pointsPerAssist\" id=\"pointsPerAssist\" placeholder=\"1\">\n          </div>\n        </div>\n        <div class=\"form-group row\">\n          <label for=\"pointsPerGWG\" class=\"col-sm-2 col-form-label\">Points per game winning goal</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" [(ngModel)]=\"pointsPerGWG\" class=\"form-control\" name=\"pointsPerGWG\" id=\"pointsPerGWG\" placeholder=\"1\">\n          </div>\n        </div>\n        <div class=\"form-group row\">\n          <label for=\"pointsPerOTG\" class=\"col-sm-2 col-form-label\">Points per overtime goal</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" [(ngModel)]=\"pointsPerOTG\" class=\"form-control\" name=\"pointsPerOTG\" id=\"pointsPerOTG\" placeholder=\"1\">\n          </div>\n        </div>\n        <div class=\"form-group row\">\n          <label for=\"pointsPerGoalieWin\" class=\"col-sm-2 col-form-label\">Points per goalie win</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" [(ngModel)]=\"pointsPerGoalieWin\" class=\"form-control\" name=\"pointsPerGoalieWin\" id=\"pointsPerGoalieWin\" placeholder=\"1\">\n          </div>\n        </div>\n        <div class=\"form-group row\">\n          <label for=\"pointsPerGoalieGoal\" class=\"col-sm-2 col-form-label\">Points per goalie goal</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" [(ngModel)]=\"pointsPerGoalieGoal\" class=\"form-control\" name=\"pointsPerGoalieGoal\" id=\"pointsPerGoalieGoal\" placeholder=\"4\">\n          </div>\n        </div>\n        <div class=\"form-group row\">\n          <label for=\"pointsPerGoalieAssist\" class=\"col-sm-2 col-form-label\">Points per goalie assist</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" [(ngModel)]=\"pointsPerGoalieAssist\" class=\"form-control\" name=\"pointsPerGoalieAssist\" id=\"pointsPerGoalieAssist\" placeholder=\"2\">\n          </div>\n        </div>\n        <div class=\"form-group row\">\n          <label for=\"pointsPerGoalieOtl\" class=\"col-sm-2 col-form-label\">Points per goalie overtime loss</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" [(ngModel)]=\"pointsPerGoalieOtl\" class=\"form-control\" name=\"pointsPerGoalieOtl\" id=\"pointsPerGoalieOtl\" placeholder=\"1\">\n          </div>\n        </div>\n        <div class=\"form-group row\">\n          <label for=\"pointsPerGoalieShutout\" class=\"col-sm-2 col-form-label\">Points per goalie shutout</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" [(ngModel)]=\"pointsPerGoalieShutout\" class=\"form-control\" name=\"pointsPerGoalieShutout\" id=\"pointsPerGoalieOtl\" placeholder=\"1\">\n          </div>\n        </div>\n        <div class=\"alert alert-danger\" role=\"alert\" *ngIf=\"errorMessage\">{{errorMessage}}</div>\n        <div class=\"alert alert-success\" role=\"alert\" *ngIf=\"successMessage\">{{successMessage}}</div>\n        <div class=\"form-group row\">\n          <div class=\"offset-sm-2 col-sm-10\">\n            <button (click)=\"createPool()\" [disabled]=\"!isValid()\" class=\"btn btn-primary\">Create Pool</button>\n          </div>\n\n        </div>\n      </form>\n    </div>\n  </div>\n  ",
        animations: [
            animations_1.trigger('fade', [
                animations_1.transition('void => *', [
                    animations_1.style({ opacity: 0 }),
                    animations_1.animate('500ms ease-in', animations_1.style({ opacity: 1 }))
                ])
            ])
        ]
    }),
    core_1.Injectable(),
    __metadata("design:paramtypes", [angular2_jwt_1.AuthHttp])
], CreatePoolComponent);
exports.CreatePoolComponent = CreatePoolComponent;
//# sourceMappingURL=createPool.component.js.map