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
var router_1 = require("@angular/router");
var angular2_jwt_1 = require("angular2-jwt");
var PoolAccountViewComponent = (function () {
    function PoolAccountViewComponent(route, http, router) {
        this.route = route;
        this.http = http;
        this.router = router;
        this.pool = {};
        this.poolAccount = {};
        this.skaters = [];
        this.goalies = [];
        this.userId = 0;
        this.jwtHelper = new angular2_jwt_1.JwtHelper();
        this.isAdding = false;
        this.isEditing = false;
        this.participantTeamName = "Loading...";
        this.userId = this.jwtHelper.decodeToken(localStorage.getItem('id_token'))._doc._id;
    }
    PoolAccountViewComponent.prototype.isAdmin = function () {
        return this.pool && this.userId == this.pool.owner;
    };
    PoolAccountViewComponent.prototype.getTeamLogo = function (team) {
        return "/images/teams/" + team + ".gif";
    };
    PoolAccountViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.params.subscribe(function (params) {
            var url = "/api/pool/" + params['id'] + "/poolAccount/" + params['accountId'];
            _this.http.get(url).map(function (res) { return res.json(); })
                .subscribe(function (pool) { _this.initPoolAccount(pool); }, function (error) { return console.log(error); });
        });
    };
    PoolAccountViewComponent.prototype.initPoolAccount = function (poolRes) {
        if (poolRes) {
            this.pool = poolRes.pool;
            this.poolAccount = poolRes.poolAccount;
        }
        this.skaters = [];
        this.goalies = [];
        this.participantTeamName = this.poolAccount.teamName;
        if (this.pool && this.poolAccount) {
            var ctx_1 = this;
            this.poolAccount.players.forEach(function (player) {
                if (player.position != 'Goalie') {
                    ctx_1.skaters.push({ name: player.name, team: player.team, goals: player.goals,
                        assists: player.assists, points: player.points,
                        gwg: player.gwg, otg: player.otg, poolPoints: ctx_1.calculateTotalPoints(player), injury: player.injury, active: player.active });
                }
                else {
                    ctx_1.goalies.push({ name: player.name, team: player.team, wins: player.wins, losses: player.losses, goals: player.goals, assists: player.assists,
                        otl: player.otl, shutouts: player.shutouts, active: player.active,
                        poolPoints: ctx_1.calculateTotalPoints(player), injury: player.injury });
                }
            });
            this.skaters.sort(function (a, b) {
                return b.poolPoints - a.poolPoints;
            });
            this.goalies.sort(function (a, b) {
                return b.poolPoints - a.poolPoints;
            });
        }
    };
    PoolAccountViewComponent.prototype.addPlayer = function () {
        var _this = this;
        this.http.post('/api/pool/' + this.pool._id + '/poolAccount/' + this.poolAccount._id + '/player/' + this.playerName, {})
            .map(function (res) { return res.json(); })
            .subscribe(function (response) { _this.processAddPlayerResponse(response); }, function (error) { return console.log(error); });
    };
    PoolAccountViewComponent.prototype.removePlayer = function (player) {
        var _this = this;
        this.http.delete('/api/pool/' + this.pool._id + '/poolAccount/' + this.poolAccount._id + '/player/' + player.name, {})
            .map(function (res) { return res.json(); })
            .subscribe(function (response) { _this.processRemovePlayerResponse(response); }, function (error) { return console.log(error); });
    };
    PoolAccountViewComponent.prototype.processAddPlayerResponse = function (response) {
        this.playerName = "";
        if (response.success && response.player) {
            this.playerAddFail = null;
            this.playerAddSuccess = "Sucessfully added.";
            this.poolAccount.players.push(response.player);
            this.initPoolAccount(null);
        }
        else {
            this.playerAddFail = "Failed to add player";
            this.playerAddSuccess = null;
        }
    };
    PoolAccountViewComponent.prototype.processRemovePlayerResponse = function (response) {
        if (response.success && response.player) {
            var index = -1;
            for (var i = 0; i < this.poolAccount.players.length; i++) {
                if (this.poolAccount.players[i].name == response.player.name) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) {
                this.poolAccount.players.splice(index, 1);
                this.initPoolAccount(null);
            }
        }
    };
    PoolAccountViewComponent.prototype.openPlayerView = function (player) {
        this.router.navigate(['/player/', player.name]);
    };
    PoolAccountViewComponent.prototype.calculateTotalPoints = function (player) {
        var totalPoints = 0;
        if (player.position != 'Goalie') {
            totalPoints += (this.pool.pointsPerGoal * player.goals);
            totalPoints += (this.pool.pointsPerAssist * player.assists);
            totalPoints += (this.pool.pointsPerGWG * player.gwg);
            totalPoints += (this.pool.pointsPerOTG * player.otg);
        }
        else {
            totalPoints += (this.pool.pointsPerGoalieWin * player.wins);
            totalPoints += (this.pool.pointsPerGoalieShutout * player.shutouts);
            totalPoints += (this.pool.pointsPerGoalieOtl * player.otl);
            totalPoints += (this.pool.pointsPerGoalieGoal * player.goals);
            totalPoints += (this.pool.pointsPerGoalieAssist * player.assists);
        }
        return totalPoints;
    };
    return PoolAccountViewComponent;
}());
PoolAccountViewComponent = __decorate([
    core_1.Component({
        template: "\n  <a class=\"btn btn-sm btn-primary\" role=\"button\" *ngIf=\"pool\" [routerLink]=\"['/pool/view/',pool._id]\"><i class=\"fa fa-1 fa-arrow-left\"></i> Back to {{pool.name}}</a>\n  <div class=\"card\">\n    <div class=\"card-header\">\n      <h3>{{participantTeamName}}</h3>\n      <h4 style=\"float:right\" *ngIf=\"poolAccount && poolAccount.account\">Owner: {{poolAccount.account.name}}</h4>\n      <button class=\"btn btn-primary\" *ngIf=\"isAdmin()\" (click)=\"isEditing = !isEditing\"><i class=\"fa fa-edit\"></i> Edit Account</button>\n      <button [@fade] class=\"btn btn-success\" *ngIf=\"isEditing\" (click)=\"isAdding = !isAdding\"><i class=\"fa fa-user-plus\"></i> Add Player</button>\n      <div [@fade] *ngIf=\"isEditing && isAdding\">\n        <form class=\"form-inline\">\n          <input class=\"form-control\" type=\"text\" name=\"playerName\" [(ngModel)]=\"playerName\" placeholder=\"Player name\"/><button class=\"btn btn-secondary\" (click)=\"addPlayer()\"><i class=\"fa fa-plus-square\"></i> Add</button>\n          <div class=\"alert alert-success\" *ngIf=\"playerAddSuccess\">{{playerAddSuccess}}</div>\n          <div class=\"alert alert-danger\" *ngIf=\"playerAddFail\">{{playerAddFail}}</div>\n        </form>\n      </div>\n    </div>\n    <div class=\"card-block\">\n      <h4>Skaters</h4>\n      <table class=\"table table-hover shadow\">\n        <thead>\n          <th>Name</th>\n          <th>Team</th>\n          <th>Goals<sup>{{pool.pointsPerGoal}}</sup></th>\n          <th>Assists<sup>{{pool.pointsPerAssist}}</sup></th>\n          <th>Points</th>\n          <th>GWG<sup>{{pool.pointsPerGWG}}</sup></th>\n          <th>OTG<sup>{{pool.pointsPerOTG}}</sup></th>\n          <th>Pool Points</th>\n          <th *ngIf=\"isEditing\"></th>\n        </thead>\n        <tbody>\n          <tr [ngClass]=\"{'inactive': skater.active === false}\" [@fade] *ngFor=\"let skater of skaters\" style=\"cursor:pointer\">\n            <td (click)=\"openPlayerView(skater)\">{{skater.name}} <span *ngIf=\"skater.injury && skater.injury.length > 0\" class=\"badge badge-pill badge-default\" title=\"{{skater.injury}}\"><i class=\"fa fa-wheelchair\"></i></span></td>\n            <td><img class=\"logo\" [src]=\"getTeamLogo(skater.team)\" /></td>\n            <td>{{skater.goals}}</td>\n            <td>{{skater.assists}}</td>\n            <td>{{skater.points}}</td>\n            <td>{{skater.gwg}}</td>\n            <td>{{skater.otg}}</td>\n            <td>{{skater.poolPoints}}</td>\n            <td style=\"width:50px\" *ngIf=\"isEditing\"><button [@fade] class=\"btn btn-danger btn-sm\" (click)=\"removePlayer(skater)\"><i class=\"fa fa-trash-o\"></i></button></td>\n          </tr>\n        </tbody>\n      </table>\n      <h4>Goalies</h4>\n      <table class=\"table table-hover\">\n        <thead>\n          <th>Name</th>\n          <th>Team</th>\n          <th>Wins<sup>{{pool.pointsPerGoalieWin}}</sup></th>\n          <th>Losses</th>\n          <th>Shutouts<sup>{{pool.pointsPerGoalieShutout}}</sup></th>\n          <th>OTL<sup>{{pool.pointsPerGoalieOtl}}</sup></th>\n          <th>Goals<sup>{{pool.pointsPerGoalieGoal}}</sup></th>\n          <th>Assists<sup>{{pool.pointsPerGoalieAssist}}</sup></th>\n          <th>Pool Points</th>\n          <th *ngIf=\"isEditing\"></th>\n        </thead>\n        <tbody>\n          <tr [ngClass]=\"{'inactive': goalie.active === false}\" [@fade] *ngFor=\"let goalie of goalies\"  style=\"cursor:pointer\">\n            <td (click)=\"openPlayerView(goalie)\">{{goalie.name}}  <span *ngIf=\"goalie.injury && goalie.injury.length > 0\" title=\"{{goalie.injury}}\" class=\"badge badge-pill badge-default\"><i class=\"fa fa-wheelchair\"></i></span></td>\n            <td><img class=\"logo\" [src]=\"getTeamLogo(goalie.team)\" /></td>\n            <td>{{goalie.wins}}</td>\n            <td>{{goalie.losses}}</td>\n            <td>{{goalie.shutouts}}</td>\n            <td>{{goalie.otl}}</td>\n            <td>{{goalie.goals}}</td>\n            <td>{{goalie.assists}}</td>\n            <td>{{goalie.poolPoints}}</td>\n            <td style=\"width:50px\" *ngIf=\"isEditing\"><button [@fade] class=\"btn btn-sm btn-danger\" (click)=\"removePlayer(goalie)\"><i class=\"fa fa-trash-o\"></i></button></td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  </div>\n  ",
        animations: [
            animations_1.trigger('shrink', [
                animations_1.transition('* => void', [
                    animations_1.style({ height: '*' }),
                    animations_1.animate('250ms ease-in', animations_1.style({ height: 0 }))
                ]),
                animations_1.transition('void => *', [
                    animations_1.style({ height: '0' }),
                    animations_1.animate('250ms ease-out', animations_1.style({ height: '*' }))
                ]),
            ]),
            animations_1.trigger('fade', [
                animations_1.transition('void => *', [
                    animations_1.style({ opacity: 0 }),
                    animations_1.animate('200ms ease-in', animations_1.style({ opacity: 1 }))
                ])
            ])
        ]
    }),
    core_1.Injectable(),
    __metadata("design:paramtypes", [router_1.ActivatedRoute, angular2_jwt_1.AuthHttp, router_1.Router])
], PoolAccountViewComponent);
exports.PoolAccountViewComponent = PoolAccountViewComponent;
//# sourceMappingURL=poolAccountView.component.js.map