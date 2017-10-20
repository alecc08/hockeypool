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
var md5_1 = require("ts-md5/dist/md5");
var MyAccountComponent = (function () {
    function MyAccountComponent(http, router) {
        this.http = http;
        this.router = router;
        this.accountUrl = "/api/account";
        this.jwtHelper = new angular2_jwt_1.JwtHelper();
    }
    MyAccountComponent.prototype.ngOnInit = function () {
        this.mainPageSetting = this.jwtHelper.decodeToken(localStorage.getItem('id_token'))._doc.mainPage || "home";
        console.log(this.mainPageSetting);
    };
    MyAccountComponent.prototype.mainPagePreferenceChange = function () {
        var _this = this;
        this.http.put(this.accountUrl, {
            mainPage: this.mainPageSetting
        }).subscribe(//call the post
        function (//call the post
            data) { return _this.handlePagePrefChangeResponse(data); }, // put the data returned from the server in our variable
        function (// put the data returned from the server in our variable
            error) { }, // in case of failure show this message
        function () { } //run this code in all cases
        );
    };
    MyAccountComponent.prototype.handlePagePrefChangeResponse = function (data) {
        data = data.json();
        JSON.stringify(data);
        if (data.success) {
            this.mainPageMessageSuccess = data.message;
        }
        else {
            this.mainPageMessageSuccess = null;
        }
    };
    MyAccountComponent.prototype.passwordChange = function () {
        var _this = this;
        this.http.put(this.accountUrl, {
            password: md5_1.Md5.hashStr("sodium" + this.passwordNew1)
        }).subscribe(//call the post
        function (//call the post
            data) { return _this.handlePasswordChangeResponse(data); }, // put the data returned from the server in our variable
        function (// put the data returned from the server in our variable
            error) { }, // in case of failure show this message
        function () { } //run this code in all cases
        );
        this.passwordNew1 = "";
        this.passwordNew2 = "";
    };
    MyAccountComponent.prototype.handlePasswordChangeResponse = function (data) {
        data = data.json();
        if (data.success) {
            this.success = data.message;
        }
        else {
            this.error = "Failed to change password";
        }
    };
    MyAccountComponent.prototype.isValid = function () {
        if (this.passwordNew1 && this.passwordNew2 && this.passwordNew1.length > 0 && this.passwordNew1 == this.passwordNew2) {
            return true;
        }
        return false;
    };
    MyAccountComponent.prototype.handleResponse = function (data) {
        try {
            data = JSON.parse(data);
            if (data.success) {
                this.success = data.message;
                this.error = null;
            }
            else {
                this.success = null;
                this.error = data.message;
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    return MyAccountComponent;
}());
MyAccountComponent = __decorate([
    core_1.Component({
        template: "\n  <div [@fade]>\n    <div>\n      <div class=\"card-header\">\n        <h3>Account Settings</h3>\n      </div>\n      <div class=\"card\">\n        <div class=\"card-block\">\n\n        <div class=\"form-group row\">\n          <label for=\"homePage\" class=\"col-form-label\">Main page: </label>\n          <select class=\"custom-select mb-2 mr-sm-2 mb-sm-0\" id=\"homePage\" [(ngModel)]=\"mainPageSetting\" (change)=\"mainPagePreferenceChange()\">\n            <option value=\"home\">Home page</option>\n            <option value=\"pool\">Main Pool</option>\n          </select>\n          <span class=\"alert alert-success\" role=\"alert\" *ngIf=\"mainPageMessageSuccess\">{{mainPageMessageSuccess}}</span>\n        </div>\n\n        <h4>Change password</h4>\n        <form>\n          <div class=\"form-group row\">\n            <input type=\"password\" class=\"form-control\" id=\"passwordNew1\" name=\"passwordNew1\" placeholder=\"New password\" required [(ngModel)]=\"passwordNew1\" />\n          </div>\n          <div class=\"form-group row\">\n            <input type=\"password\" class=\"form-control\" id=\"passwordNew2\" name=\"passwordNew2\"  placeholder=\"Repeat new password\" required [(ngModel)]=\"passwordNew2\" />\n          </div>\n          <div class=\"form-group row\">\n            <button (click)=\"passwordChange()\" [disabled]=\"!isValid()\" class=\"btn btn-primary\">Change</button>\n          </div>\n        </form>\n        <span class=\"alert alert-danger\" role=\"alert\" *ngIf=\"error\">{{error}}</span>\n        <span class=\"alert alert-success\" role=\"alert\" *ngIf=\"success\">{{success}}</span>\n        </div>\n      </div>\n    </div>\n\n  </div>\n  ",
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
], MyAccountComponent);
exports.MyAccountComponent = MyAccountComponent;
//# sourceMappingURL=myAccount.component.js.map