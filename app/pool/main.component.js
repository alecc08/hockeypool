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
var router_1 = require("@angular/router");
var angular2_jwt_1 = require("angular2-jwt");
var MainComponent = (function () {
    function MainComponent(http, router) {
        this.http = http;
        this.router = router;
        this.jwtHelper = new angular2_jwt_1.JwtHelper();
        if (this.jwtHelper.decodeToken(localStorage.getItem('id_token'))._doc.mainPage == "pool") {
            this.router.navigate(['/pool/view/', this.jwtHelper.decodeToken(localStorage.getItem('id_token'))._doc.mainPool]);
        }
        else {
            this.router.navigate(['/home']);
        }
    }
    return MainComponent;
}());
MainComponent = __decorate([
    core_1.Component({
        template: ""
    }),
    core_1.Injectable(),
    __metadata("design:paramtypes", [angular2_jwt_1.AuthHttp, router_1.Router])
], MainComponent);
exports.MainComponent = MainComponent;
//# sourceMappingURL=main.component.js.map