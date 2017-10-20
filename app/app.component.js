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
var angular2_jwt_1 = require("angular2-jwt");
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var md5_1 = require("ts-md5/dist/md5");
var AppComponent = (function () {
    function AppComponent(http, router) {
        this.http = http;
        this.router = router;
        this.loginUrl = "/api/authenticate";
        this.poolUrl = "/api/pool";
        this.jwtHelper = new angular2_jwt_1.JwtHelper();
    }
    AppComponent.prototype.login = function () {
        var _this = this;
        var body = JSON.stringify({ "email": this.emailInput, "password": md5_1.Md5.hashStr("sodium" + this.passwordInput.toString()) });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers, method: "post" });
        this.http.post(this.loginUrl, body, options)
            .subscribe(//call the post
        function (//call the post
            data) { return _this.handleLoginResponse(data.text()); }, // put the data returned from the server in our variable
        function (// put the data returned from the server in our variable
            error) { return console.log("Error HTTP Post Service"); }, // in case of failure show this message
        function () { return console.log("Job Done Post !"); } //run this code in all cases
        );
    };
    AppComponent.prototype.loggedIn = function () {
        return angular2_jwt_1.tokenNotExpired();
    };
    AppComponent.prototype.logout = function () {
        console.log("Removing id_token");
        localStorage.removeItem('id_token');
        this.router.navigate(["unauthorized"]);
    };
    AppComponent.prototype.handleLoginResponse = function (data) {
        try {
            console.log(data);
            data = JSON.parse(data);
            if (data && data.success) {
                localStorage.setItem('id_token', data.token);
                if (this.jwtHelper.decodeToken(data.token)._doc.mainPage == "pool") {
                    this.router.navigate(["/pool/view/", this.jwtHelper.decodeToken(data.token)._doc.mainPool]);
                }
                else {
                    this.router.navigate(["/"]);
                }
            }
            else {
                console.log("No success detected");
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'app',
        template: "\n\n  <nav class=\"bigshadow navbar navbar-toggleable-sm navbar-light bg-faded navbar-inverse bg-inverse\">\n  <div class=\"container\">\n    <button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarToggler\" aria-controls=\"navbarToggler\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n      <span class=\"navbar-toggler-icon\"></span>\n    </button>\n    <div class=\"collapse navbar-collapse mt-2 mt-lg-0\" id=\"navbarToggler\">\n      <ul class=\"navbar-nav mr-auto\">\n        <li class=\"nav-item\"><a routerLink=\"/home\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{ exact: true }\" class=\"nav-link\"><i class=\"fa fa-home\"></i> Home</a></li>\n        <li class=\"nav-item\"><a *ngIf=\"loggedIn()\" routerLink=\"/pool/view\" routerLinkActive=\"active\" class=\"nav-link\" ><i class=\"fa fa-star-o\"></i> My Pools</a></li>\n        <li class=\"nav-item\"><a *ngIf=\"loggedIn()\" routerLink=\"/stats\" routerLinkActive=\"active\" class=\"nav-link\" ><i class=\"fa fa-bar-chart\"></i> All Stats</a></li>\n        <li class=\"nav-item\"><a *ngIf=\"loggedIn()\" routerLink=\"/pool/create\" routerLinkActive=\"active\" class=\"nav-link\" ><i class=\"fa fa-plus-square\"></i> Create Pool</a></li>\n        <li class=\"nav-item\"><a *ngIf=\"loggedIn()\" routerLink=\"/account\" routerLinkActive=\"active\" class=\"nav-link\"><i class=\"fa fa-id-badge\"></i> Account</a></li>\n      </ul>\n      <div class=\"navbar-text\">\n        <form class=\"form-inline\">\n          <input type=\"text\" class=\"form-control form-control-sm\" [(ngModel)]=\"emailInput\" *ngIf=\"!loggedIn()\" placeholder=\"Email\" name=\"email\" width=\"20\">\n          <input type=\"password\" class=\"form-control form-control-sm\" [(ngModel)]=\"passwordInput\" *ngIf=\"!loggedIn()\" placeholder=\"Password\" name=\"password\">\n          <button id=\"login\" (click)=\"login()\" class=\"btn btn-sm btn-outline-secondary form-control form-control-sm\" *ngIf=\"!loggedIn()\"><i class=\"fa fa-sign-in\"></i> Log In</button>\n          <button id=\"logout\" (click)=\"logout()\" class=\"btn btn-sm btn-outline-secondary form-control form-control-sm\" *ngIf=\"loggedIn()\"><i class=\"fa fa-sign-out\"></i> Log Out</button>\n          <a routerLink=\"/register\" routerLinkActive=\"active\" class=\"btn\" *ngIf=\"!loggedIn()\">Register</a>\n        </form>\n      </div>\n    </div>\n  </div>\n</nav>\n\n<div class=\"container\">\n  <div class=\"bigshadow jumbotron header\">\n      <h2 class=\"display-4 headerText\">Al's Hockey Pool</h2>\n  </div>\n</div>\n\n\n<div class=\"container\" style=\"margin-top:-30px;\">\n    <router-outlet></router-outlet>\n    <div class=\"footer\">\n        <hr class=\"m-y-2\"/>\n        <p>Copyright 2017&copy; Alec Chamberland</p>\n    </div>\n</div>\n  "
    }),
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, router_1.Router])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map