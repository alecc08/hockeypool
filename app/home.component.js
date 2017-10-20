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
var animations_1 = require("@angular/animations");
var angular2_jwt_1 = require("angular2-jwt");
require("rxjs/add/operator/map");
var HomeComponent = (function () {
    function HomeComponent(http) {
        var _this = this;
        this.http = http;
        http.get("/api/players?type=Skater&limit=5").map(function (res) { return res.json(); }).subscribe(function (players) { _this.topSkaters = players; }, function (error) { return console.log(error); });
        http.get("/api/players?type=Goalie&sort=wins&limit=5").map(function (res) { return res.json(); }).subscribe(function (players) { _this.topGoalies = players; }, function (error) { return console.log(error); });
        http.get("/api/websiteMessage").map(function (res) { return res.json(); }).subscribe(function (messageOfTheDay) { _this.messageOfTheDay = messageOfTheDay; }, function (error) { return console.log(error); });
    }
    HomeComponent.prototype.getTeamLogo = function (team) {
        return "/images/teams/" + team + ".gif";
    };
    return HomeComponent;
}());
HomeComponent = __decorate([
    core_1.Component({
        template: "\n  <div class=\"container-fluid\" [@fade]>\n    <div class=\"alert alert-success bigshadow\" *ngIf=\"messageOfTheDay && messageOfTheDay.message.length > 0\">\n      <h4 class=\"alert-heading\">Message of the day</h4>\n      <p>{{messageOfTheDay.message}}</p>\n    </div>\n    <div class=\"card\">\n      <div class=\"card-header\">\n        <h3>Top Players</h3>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-xl-6 col-lg-12\" style=\"text-align:center\">\n          <div class=\"card\">\n            <div class=\"card-text\">\n                <h4>Skaters</h4>\n                <table class=\"table\">\n                  <thead>\n                    <th>Name</th>\n                    <th>Team</th>\n                    <th>Goals</th>\n                    <th>Assists</th>\n                    <th>Points</th>\n                    <th>GWG</th>\n                    <th>OTG</th>\n                  </thead>\n                  <tbody>\n                    <tr *ngFor=\"let skater of topSkaters\">\n                      <td><a [routerLink]=\"['/player', skater.name]\">{{skater.name}} <span *ngIf=\"skater.injury && skater.injury.length > 0\" class=\"badge badge-pill badge-default\" title=\"{{skater.injury}}\"><i class=\"fa fa-wheelchair\"></i></span></a></td>\n                      <td><img class=\"logo\" [src]=\"getTeamLogo(skater.team)\" /></td>\n                      <td>{{skater.goals}}</td>\n                      <td>{{skater.assists}}</td>\n                      <td>{{skater.points}}</td>\n                      <td>{{skater.gwg}}</td>\n                      <td>{{skater.otg}}</td>\n                    </tr>\n                  </tbody>\n                </table>\n              </div>\n            </div>\n          </div>\n          <div class=\"col-xl-6 col-lg-12\" style=\"text-align:center\">\n          <div class=\"card\">\n            <div class=\"card-text\">\n            <h4>Goalies</h4>\n            <table class=\"table\">\n              <thead>\n                <th>Name</th>\n                <th>Team</th>\n                <th>Wins</th>\n                <th>OTL</th>\n                <th>SO</th>\n                <th>GAA</th>\n                <th>SV%</th>\n              </thead>\n              <tbody>\n                <tr *ngFor=\"let goalie of topGoalies\">\n                  <td><a [routerLink]=\"['/player', goalie.name]\">{{goalie.name}} <span *ngIf=\"goalie.injury && goalie.injury.length > 0\" class=\"badge badge-pill badge-default\" title=\"{{goalie.injury}}\"><i class=\"fa fa-wheelchair\"></i></span></a></td>\n                  <td><img class=\"logo\" [src]=\"getTeamLogo(goalie.team)\" /></td>\n                  <td>{{goalie.wins}}</td>\n                  <td>{{goalie.otl}}</td>\n                  <td>{{goalie.shutouts}}</td>\n                  <td>{{goalie.gaa}}</td>\n                  <td>{{goalie.savePercent}}</td>\n                </tr>\n              </tbody>\n            </table>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n  ",
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
], HomeComponent);
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map