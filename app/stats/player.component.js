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
var core_2 = require("@angular/core");
var angular2_jwt_1 = require("angular2-jwt");
var router_1 = require("@angular/router");
require("rxjs/add/operator/map");
var PlayerComponent = (function () {
    function PlayerComponent(http, route) {
        this.http = http;
        this.route = route;
        this.players = [{}];
    }
    PlayerComponent.prototype.getTeamLogo = function (team) {
        return "/images/teams/" + team + ".gif";
    };
    PlayerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.params.subscribe(function (params) {
            var url = "/api/players/" + params['name'];
            _this.http.get(url).map(function (res) { return res.json(); }).subscribe(function (player) { _this.players = player; }, function (error) { return console.log(error); });
        });
    };
    return PlayerComponent;
}());
PlayerComponent = __decorate([
    core_1.Component({
        template: "\n\n\n  <div class=\"card\" [@fade]>\n    <div class=\"card-header\"><h1>Player Information</h1></div>\n    <div class=\"card-block\">\n    <table *ngFor=\"let player of players\" class=\"table table-striped\">\n    <tbody *ngIf=\"player.position!='Goalie'\">\n      <tr><td colspan=\"2\"><img [src]=\"getTeamLogo(player.team)\" /></td></tr>\n      <tr><td>Name:</td><td> {{player.name}} </td></tr>\n      <tr *ngIf=\"player.injury && player.injury.length > 0\"> <td colspan=\"2\"><div class=\"alert alert-danger\"><span class=\"badge badge-pill badge-default\"><i class=\"fa fa-wheelchair\"></i></span> INJURED: {{player.injury}}</div></td></tr>\n      <tr><td>Position:</td><td>  {{player.position}}</td></tr>\n      <tr><td>Team:</td><td>  {{player.team}} </td></tr>\n      <tr><td>Games Played:</td><td>  {{player.gamesPlayed}}</td></tr>\n      <tr><td>Goals:</td><td>  {{player.goals}}</td></tr>\n      <tr><td>Assists:</td><td>  {{player.assists}}</td></tr>\n      <tr><td>Points:</td><td>  {{player.points}}</td></tr>\n      <tr><td>+/-:</td><td>  {{player.pm}}</td></tr>\n      <tr><td>Game winning goals:</td><td>  {{player.gwg}}</td></tr>\n      <tr><td>Overtime Goals:</td><td>  {{player.otg}}</td></tr>\n      <tr><td>Penalty in minutes:</td><td>  {{player.pim}}</td></tr>\n      <tr><td>Shots:</td><td>  {{player.shots}}</td></tr>\n      <tr><td>Powerplay Goals:</td><td>  {{player.ppg}}</td></tr>\n      <tr><td>Powerplay Points:</td><td>  {{player.ppp}}</td></tr>\n      <tr><td>Shorthanded goals:</td><td>  {{player.shg}}</td></tr>\n      <tr><td>Shorthanded points:</td><td>  {{player.shp}}</td></tr>\n      <tr><td>Stats Updated:</td><td>  {{player.lastUpdated}} </td></tr>\n      </tbody>\n\n      <tbody *ngIf=\"player.position==='Goalie'\">\n        <tr><td colspan=\"2\"><img *ngIf=\"player\" [src]=\"getTeamLogo(player.team)\" /></td></tr>\n        <tr><td>Name:</td><td> {{player.name}} </td></tr>\n        <tr *ngIf=\"player.injury && player.injury.length > 0\"> <td colspan=\"2\"><div class=\"alert alert-danger\"><span class=\"badge badge-pill badge-default\"><i class=\"fa fa-wheelchair\"></i></span>INJURED: {{player.injury}}</div></td></tr>\n        <tr><td>Position:</td><td>  {{player.position}}</td></tr>\n        <tr><td>Team:</td><td>  {{player.team}} </td></tr>\n        <tr><td>Games Played:</td><td>  {{player.gamesPlayed}}</td></tr>\n        <tr><td>Wins:</td><td>  {{player.wins}}</td></tr>\n        <tr><td>Losses:</td><td>  {{player.losses}}</td></tr>\n        <tr><td>Overtime losses:</td><td>  {{player.otl}}</td></tr>\n        <tr><td>Shutouts:</td><td>  {{player.shutouts}}</td></tr>\n        <tr><td>Shots Against:</td><td>  {{player.shotsAgainst}}</td></tr>\n        <tr><td>Goals Against:</td><td>  {{player.goalsAgainst}}</td></tr>\n        <tr><td>GAA:</td><td>  {{player.gaa}}</td></tr>\n        <tr><td>Saves:</td><td>  {{player.saves}}</td></tr>\n        <tr><td>Save %:</td><td>  {{player.savePercent}}</td></tr>\n        <tr><td>Goals:</td><td>  {{player.goals}}</td></tr>\n        <tr><td>Assists:</td><td>  {{player.assists}}</td></tr>\n\n        <tr><td>Stats Updated:</td><td>  {{player.lastUpdated}} </td></tr>\n        </tbody>\n      </table>\n    </div>\n  </div>\n  ",
        animations: [
            animations_1.trigger('fade', [
                animations_1.transition('void => *', [
                    animations_1.style({ opacity: 0 }),
                    animations_1.animate('500ms ease-in', animations_1.style({ opacity: 1 }))
                ])
            ])
        ]
    }),
    core_2.Injectable(),
    __metadata("design:paramtypes", [angular2_jwt_1.AuthHttp, router_1.ActivatedRoute])
], PlayerComponent);
exports.PlayerComponent = PlayerComponent;
//# sourceMappingURL=player.component.js.map