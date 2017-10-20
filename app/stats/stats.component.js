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
require("rxjs/add/operator/map");
var StatsComponent = (function () {
    function StatsComponent(http) {
        var _this = this;
        this.http = http;
        this.players = [{ name: "Loading..." }];
        http.get("/api/players").map(function (res) { return res.json(); }).subscribe(function (players) { _this.players = players; }, function (error) { return console.log(error); });
    }
    StatsComponent.prototype.getTeamLogo = function (team) {
        return "/images/teams/" + team + ".gif";
    };
    StatsComponent.prototype.refreshWithFilter = function () {
        var _this = this;
        this.http.get("/api/players?team=canadiens&limit=50").map(function (res) { return res.json(); }).subscribe(function (players) { _this.players = players; }, function (error) { return console.log(error); });
    };
    return StatsComponent;
}());
StatsComponent = __decorate([
    core_1.Component({
        template: "\n\n  <div class=\"card\" [@fade]>\n    <div class=\"card-header\"><h3>All Player Stats</h3></div>\n    <select class=\"custom-select\" id=\"inlineFormCustomSelect\" (change)=\"refreshWithFilter()\">\n      <option selected>Team</option>\n      <option value=\"canadiens\">Canadiens</option>\n      <option value=\"2\">Two</option>\n      <option value=\"3\">Three</option>\n    </select>\n    <select class=\"custom-select\" id=\"inlineFormCustomSelect2\">\n      <option selected>Max Results</option>\n      <option value=\"10\">10</option>\n      <option value=\"20\">20</option>\n      <option value=\"50\">50</option>\n      <option value=\"100\">100</option>\n      <option value=\"500\">500</option>\n    </select>\n    <div class=\"card-block\">\n      <table class=\"table shadow\"> <!--Players -->\n        <thead>\n          <tr>\n            <th>Name</th>\n            <th>Team</th>\n            <th>Pos</th>\n            <th>GP</th>\n            <th>G</th>\n            <th>A</th>\n            <th>P</th>\n            <th>+/-</th>\n            <th>GWG</th>\n            <th>OTG</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr *ngFor=\"let player of players\">\n            <td><i *ngIf=\"players.length == 1\" class=\"fa fa-refresh fa-spin fa-3x fa-fw\"></i><a [routerLink]=\"['/player', player.name]\">{{player.name}} <span *ngIf=\"player.injury && player.injury.length > 0\" class=\"badge badge-pill badge-default\" title=\"{{player.injury}}\"><i class=\"fa fa-wheelchair\"></i></span></a></td>\n            <td><img *ngIf=\"players.length > 1\" class=\"logo\" [src]=\"getTeamLogo(player.team)\" /></td>\n            <td>{{player.position}}</td>\n            <td>{{player.gp}}</td>\n            <td>{{player.goals}}</td>\n            <td>{{player.assists}}</td>\n            <td>{{player.points}}</td>\n            <td>{{player.pm}}</td>\n            <td>{{player.gwg}}</td>\n            <td>{{player.otg}}</td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  </div>\n  ",
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
    __metadata("design:paramtypes", [angular2_jwt_1.AuthHttp])
], StatsComponent);
exports.StatsComponent = StatsComponent;
//# sourceMappingURL=stats.component.js.map