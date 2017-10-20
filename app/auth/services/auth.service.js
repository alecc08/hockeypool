"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular2_jwt_1 = require("angular2-jwt");
/*import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';*/
var AuthService = (function () {
    function AuthService() {
    }
    AuthService.prototype.loggedIn = function () {
        return angular2_jwt_1.tokenNotExpired();
    };
    AuthService.prototype.login = function (email, password) {
        //this.http.post("//api/authenticate", {email: email,password:password}).map(res => res.json()).subscribe(msg => {console.log(msg)}, error => console.log(error));
    };
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map