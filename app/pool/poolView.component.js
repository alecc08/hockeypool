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
var pool_service_1 = require("../service/pool.service");
var PoolViewComponent = (function () {
    function PoolViewComponent(route, http, router, poolService) {
        this.route = route;
        this.http = http;
        this.router = router;
        this.poolService = poolService;
        this.pool = {};
        this.rows = [];
        this.userId = 0;
        this.isOwner = false;
        this.jwtHelper = new angular2_jwt_1.JwtHelper();
        this.inviteOpen = false;
        this.editMode = false;
        this.messages = [];
        this.chatHidden = "true";
        this.userId = this.jwtHelper.decodeToken(localStorage.getItem('id_token'))._doc._id;
    }
    PoolViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.params.subscribe(function (params) {
            var url = "/api/pool/" + params['id'];
            _this.http.get(url).map(function (res) { return res.json(); }).subscribe(function (pool) { _this.initPool(pool); }, function (error) { return console.log(error); });
            _this.http.get('/api/pool/' + params['id'] + '/messages').map(function (res) { return res.json(); }).subscribe(function (messages) { _this.messages = messages; _this.scrollDown(); }, function (error) { return console.log(error); });
        });
    };
    PoolViewComponent.prototype.scrollDown = function () {
        var vm = this;
        setTimeout(function () {
            vm.chatWindow.nativeElement.scrollTop = vm.chatWindow.nativeElement.scrollHeight;
        }, 100);
    };
    PoolViewComponent.prototype.addText = function () {
        if (this.chatText && this.chatText.length > 0) {
            this.messages.push({ posterName: this.jwtHelper.decodeToken(localStorage.getItem('id_token'))._doc.name, message: this.chatText });
            this.http.post('/api/messages', { message: this.chatText, poolId: this.pool._id }).map(function (res) { return res.json(); }).subscribe(function (res) { return console.log(res); }, function (error) { return console.log(error); });
            this.chatText = "";
            this.scrollDown();
        }
    };
    PoolViewComponent.prototype.saveTeam = function (row) {
        row.isEditing = false;
        this.poolService.saveTeamName(this.pool._id, row.id, row.teamName);
    };
    PoolViewComponent.prototype.initPool = function (poolRes) {
        this.pool = poolRes;
        this.isOwner = (this.userId == poolRes.owner._id);
        if (this.pool && this.pool.participants) {
            var ctx_1 = this;
            this.pool.participants.forEach(function (participant) {
                ctx_1.rows.push({ id: participant._id, teamName: participant.teamName, points: ctx_1.calculateTotalPoints(participant.players) });
            });
            this.rows.sort(function (a, b) {
                return b.points - a.points;
            });
            var highestPoints = this.rows[0].points;
            var prevPoints = this.rows[0].points;
            var currentRank = 1;
            this.rows.forEach(function (row) {
                row.rank = currentRank++;
                row.behindNext = prevPoints - row.points;
                row.behindFirst = highestPoints - row.points;
                prevPoints = row.points;
            });
        }
    };
    PoolViewComponent.prototype.openPoolAccount = function (id) {
        this.router.navigate(['/pool/view/', this.pool._id, 'account', id]);
    };
    PoolViewComponent.prototype.calculateTotalPoints = function (players) {
        var totalPoints = 0;
        var ctx = this;
        players.forEach(function (player) {
            if (player.position != 'Goalie') {
                try {
                    totalPoints += (ctx.pool.pointsPerGoal * player.goals);
                    totalPoints += (ctx.pool.pointsPerAssist * player.assists);
                    totalPoints += (ctx.pool.pointsPerGWG * player.gwg);
                    totalPoints += (ctx.pool.pointsPerOTG * player.otg);
                }
                catch (e) {
                    console.log("Failed to calculate points for " + player.name);
                }
            }
            else {
                try {
                    totalPoints += (ctx.pool.pointsPerGoalieWin * player.wins);
                    totalPoints += (ctx.pool.pointsPerGoalieShutout * player.shutouts);
                    totalPoints += (ctx.pool.pointsPerGoalieOtl * player.otl);
                    totalPoints += (ctx.pool.pointsPerGoalieGoal * player.goals);
                    totalPoints += (ctx.pool.pointsPerGoalieAssist * player.assists);
                }
                catch (e) {
                    console.log("Failed to calculate points for " + player.name);
                }
            }
        });
        return totalPoints;
    };
    PoolViewComponent.prototype.deletePool = function () {
        var _this = this;
        var deletePool = confirm("Are you sure you want to delete the pool? This can't be undone.");
        if (deletePool) {
            console.log("Deleting pool " + this.pool._id);
            this.http.delete("/api/pool/" + this.pool._id).map(function (res) { return res.json(); })
                .subscribe(function (response) {
                if (response.success) {
                    _this.router.navigate(["pool", "view"]);
                }
            });
        }
    };
    PoolViewComponent.prototype.removePoolAccount = function (row) {
        var ctx = this;
        this.http.delete('/api/pool/' + this.pool._id + '/poolAccount/' + row.id).map(function (res) { return res.json(); })
            .subscribe(function (response) {
            if (response.success) {
                for (var i = 0; i < ctx.rows.length; i++) {
                    if (ctx.rows[i].id == row.id) {
                        ctx.rows.splice(i, 1);
                        break;
                    }
                }
            }
        }, function (error) { return console.log(error); });
    };
    PoolViewComponent.prototype.sendInvite = function () {
        var _this = this;
        console.log("Email:" + this.inviteEmail + " poolId: " + this.pool._id);
        this.http.post('/api/invite', { inviteEmail: this.inviteEmail, poolId: this.pool._id })
            .map(function (res) { return res.json(); }).subscribe(function (msg) {
            _this.inviteResponse = msg.message;
            _this.inviteEmail = "";
        }, function (error) { console.log(error); });
    };
    return PoolViewComponent;
}());
__decorate([
    core_1.ViewChild('chat'),
    __metadata("design:type", core_1.ElementRef)
], PoolViewComponent.prototype, "chat", void 0);
__decorate([
    core_1.ViewChild('endChat'),
    __metadata("design:type", core_1.ElementRef)
], PoolViewComponent.prototype, "endChat", void 0);
__decorate([
    core_1.ViewChild('chatWindow'),
    __metadata("design:type", core_1.ElementRef)
], PoolViewComponent.prototype, "chatWindow", void 0);
PoolViewComponent = __decorate([
    core_1.Component({
        template: "\n\n\n  <div class=\"card\">\n    <div class=\"card-header\">\n      <h3>{{pool.name}}</h3>\n      <h4 style=\"float:right\" *ngIf=\"pool && pool.owner\">Pool Manager: {{pool.owner.name}}</h4>\n      <button (click)=\"inviteOpen = !inviteOpen\" class=\"btn btn-primary\" *ngIf=\"pool\"><i class=\"fa fa-envelope-open-o\" aria-hidden=\"true\"></i> Invite</button>\n      <button (click)=\"editMode = !editMode\" class=\"btn btn-warning\" *ngIf=\"pool && isOwner\"><i class=\"fa fa-edit\" aria-hidden=\"true\"></i> Edit</button>\n      <button [@fade] [@shrink] (click)=\"deletePool()\" class=\"btn btn-danger\" *ngIf=\"editMode\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i> Delete Pool</button>\n      <div [@shrink] *ngIf=\"inviteOpen\">\n        <form class=\"form-inline\">\n          <input class=\"form-control\" type=\"text\" name=\"inviteEmail\" [(ngModel)]=\"inviteEmail\" placeholder=\"example@email.com\"/><button class=\"btn btn-secondary\" (click)=\"sendInvite()\">Send</button>\n          <span *ngIf=\"inviteResponse\">{{inviteResponse}}</span>\n        </form>\n      </div>\n    </div>\n    <div class=\"card-block\">\n      <table class=\"table table-hover shadow\">\n        <tr>\n          <th>Position</th>\n          <th>Team name</th>\n          <th></th>\n          <th>Points</th>\n          <th>Behind Next</th>\n          <th>Behind First</th>\n          <td style=\"width:50px\" *ngIf=\"editMode\"></td>\n        </tr>\n        <tr [@fade] *ngFor=\"let row of rows\" style=\"cursor:pointer\">\n          <td>{{row.rank}}</td>\n          <td *ngIf=\"!editMode || !row.isEditing\" (click)=\"openPoolAccount(row.id)\">{{row.teamName}} </td>\n          <td *ngIf=\"editMode && row.isEditing\"><form class=\"form-inline\"><input class=\"form-control\" name=\"teamName\" [(ngModel)]=\"row.teamName\" type=\"text\" /> </form></td>\n          <td>\n              <button [@fade] *ngIf=\"editMode && !row.isEditing\" style=\"float:right\" class=\"btn btn-warning btn-sm\"  (click)=\"row.isEditing=!row.isEditing\"><i class=\"fa fa-edit\" style=\"color:black;\"></i></button>\n              <button [@fade] *ngIf=\"editMode && row.isEditing\" style=\"float:right\" (click)=\"saveTeam(row)\" class=\"btn btn-success btn-sm\"><i class=\"fa fa-check-circle\" style=\"color:white;\"></i></button>\n          </td>\n          <td>{{row.points}}</td>\n          <td>{{row.behindNext}}</td>\n          <td>{{row.behindFirst}}</td>\n          <td style=\"width:50px\" *ngIf=\"editMode\"><button [@fade] [@shrink] class=\"btn btn-danger btn-sm\" (click)=\"removePoolAccount(row)\" ><i class=\"fa fa-trash-o\"></i></button></td>\n        </tr>\n      </table>\n    </div>\n  </div>\n  <div #chat [@fade] [@slim]=\"chatHidden\" class=\"card bigshadow\" style=\"height:540px; width: 350px; border: solid 2px #0275d8;position: fixed; bottom: 0; right: 10px; max-width:80%; max-height:95%;\">\n    <div style=\"position:relative; height:100%;width:100%\">\n      <div style=\"position:relative; left: -60px; height:35px;\">\n        <button class=\"btn btn-primary btn-sm\" (click)=\"chatHidden = chatHidden == 'false' ? 'true' : 'false'\"><i class=\"\" [ngClass]=\"chatHidden == 'false' ? 'fa fa-arrow-right' : 'fa fa-arrow-left'\"></i> Chat</button>\n      </div>\n      <div #chatWindow style=\"height: 480px;padding: 5px; overflow:auto; word-wrap: break-word;\">\n        <div class=\"shadow\" *ngFor=\"let message of messages\">\n          <b>{{message.posterName}}</b>: {{message.message}}\n        </div>\n        <div #endChat></div>\n      </div>\n      <div style=\"width:345px;position:fixed; bottom: 2px\" class=\"input-group\">\n        <input type=\"text\" class=\"form-control form-control-sm\" placeholder=\"Type here...\" [(ngModel)]=\"chatText\" (keyup.enter)=\"addText()\">\n      </div>\n    </div>\n  </div>\n  ",
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
            ]),
            animations_1.trigger('slim', [
                animations_1.state('true', animations_1.style({
                    right: '-350px'
                })),
                animations_1.state('false', animations_1.style({
                    right: '0'
                })),
                animations_1.transition('true => false', animations_1.animate('100ms ease-in')),
                animations_1.transition('false => true', animations_1.animate('100ms ease-out'))
            ])
        ]
    }),
    core_1.Injectable(),
    __metadata("design:paramtypes", [router_1.ActivatedRoute, angular2_jwt_1.AuthHttp, router_1.Router, pool_service_1.PoolService])
], PoolViewComponent);
exports.PoolViewComponent = PoolViewComponent;
//# sourceMappingURL=poolView.component.js.map