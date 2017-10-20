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
var MyPoolsComponent = (function () {
    function MyPoolsComponent(http, router) {
        var _this = this;
        this.http = http;
        this.router = router;
        this.poolUrl = "/api/pool";
        this.inviteUrl = "/api/invite";
        this.http.get(this.poolUrl)
            .subscribe(//call the post
        function (//call the post
            data) { return _this.handleResponse(data.text()); }, // put the data returned from the server in our variable
        function (// put the data returned from the server in our variable
            error) { }, // in case of failure show this message
        function () { } //run this code in all cases
        );
        this.http.get(this.inviteUrl)
            .subscribe(//call the post
        function (//call the post
            data) { return _this.handleInviteResponse(data.text()); }, // put the data returned from the server in our variable
        function (// put the data returned from the server in our variable
            error) { }, // in case of failure show this message
        function () { } //run this code in all cases
        );
    }
    MyPoolsComponent.prototype.openPool = function (id) {
        this.router.navigate(['/pool/view/', id]);
    };
    MyPoolsComponent.prototype.rejectInvite = function (id) {
        var _this = this;
        this.http.delete(this.inviteUrl + '/' + id)
            .subscribe(//call the post
        function (//call the post
            data) { return _this.handleInviteRejectResponse(data); }, // put the data returned from the server in our variable
        function (// put the data returned from the server in our variable
            error) { }, // in case of failure show this message
        function () { } //run this code in all cases
        );
    };
    MyPoolsComponent.prototype.acceptInvite = function (id) {
        var _this = this;
        this.http.get(this.inviteUrl + '/' + id + '/accept')
            .subscribe(//call the post
        function (//call the post
            data) { return _this.handleInviteAcceptResponse(data); }, // put the data returned from the server in our variable
        function (// put the data returned from the server in our variable
            error) { }, // in case of failure show this message
        function () { } //run this code in all cases
        );
    };
    MyPoolsComponent.prototype.handleResponse = function (data) {
        try {
            data = JSON.parse(data);
            if (data.success) {
                this.pools = data.pools;
                this.error = null;
            }
            else {
                this.error = data.message;
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    MyPoolsComponent.prototype.handleInviteRejectResponse = function (data) {
        data = JSON.parse(data._body);
        if (data.success) {
            for (var i = 0; i < this.invites.length; i++) {
                if (this.invites[i]._id == data.inviteId) {
                    this.invites.splice(i, 1);
                }
            }
        }
    };
    MyPoolsComponent.prototype.handleInviteAcceptResponse = function (data) {
        data = JSON.parse(data._body);
        if (data.success) {
            for (var i = 0; i < this.invites.length; i++) {
                if (this.invites[i]._id == data.inviteId) {
                    this.invites.splice(i, 1);
                }
            }
            this.pools.push(data.pool);
        }
    };
    MyPoolsComponent.prototype.handleInviteResponse = function (data) {
        try {
            data = JSON.parse(data);
            if (data.success) {
                this.invites = data.invites;
                this.error = null;
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    return MyPoolsComponent;
}());
MyPoolsComponent = __decorate([
    core_1.Component({
        template: "\n  <div [@fade]>\n    <div *ngIf=\"invites && invites.length > 0\">\n      <div class=\"card-header\">\n        <h3>Invites</h3>\n      </div>\n      <div class=\"card\">\n        <div class=\"card-block\">\n        <span class=\"alert alert-danger\" role=\"alert\" *ngIf=\"error\">{{error}}</span>\n        <ul class=\"list-group shadow\">\n          <li class=\"list-group-item\" *ngFor=\"let invite of invites\">\n            <h5>{{invite.pool.name}}</h5>\n            <button (click)=\"acceptInvite(invite._id)\" class=\"btn btn-success btn-sm\"><i class=\"fa fa-check-circle\"></i> Accept</button>\n            <button (click)=\"rejectInvite(invite._id)\" class=\"btn btn-danger btn-sm\"><i class=\"fa fa-ban\"></i> Reject</button>\n          </li>\n        </ul>\n        </div>\n      </div>\n    </div>\n    <div class=\"card\">\n      <div class=\"card-header\">\n        <h3>My Pools</h3>\n      </div>\n      <div class=\"card-block\">\n        <span class=\"alert alert-danger\" role=\"alert\" *ngIf=\"error\">{{error}}</span>\n        <h4>Click on a pool to view it or create a new one</h4>\n        <ul class=\"list-group shadow\">\n          <button [@fade]=\"pool\" class=\"btn btn-secondary btn-block btn-lg\" style=\"cursor:pointer\"  *ngFor=\"let pool of pools\" (click)=\"openPool(pool._id)\">\n            {{pool.name}}\n          </button>\n        </ul>\n      </div>\n    </div>\n  </div>\n  ",
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
    __metadata("design:paramtypes", [angular2_jwt_1.AuthHttp, router_1.Router])
], MyPoolsComponent);
exports.MyPoolsComponent = MyPoolsComponent;
//# sourceMappingURL=myPools.component.js.map