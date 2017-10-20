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
var http_1 = require("@angular/http");
var md5_1 = require("ts-md5/dist/md5");
var RegisterComponent = (function () {
    function RegisterComponent(http) {
        this.http = http;
        this.registerUrl = "/api/newuser";
    }
    RegisterComponent.prototype.setError = function (msg) {
        this.successMessage = null;
        this.errorMessage = msg;
    };
    RegisterComponent.prototype.setSuccess = function (msg) {
        this.successMessage = msg;
        this.errorMessage = null;
    };
    RegisterComponent.prototype.register = function () {
        var _this = this;
        var body = JSON.stringify({ "email": this.inputEmail, "password": md5_1.Md5.hashStr("sodium" + this.inputPassword.toString()), "name": this.inputName });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers, method: "post" });
        return this.http.post(this.registerUrl, body, options)
            .subscribe(//call the post
        function (//call the post
            data) { return _this.handleResponse(data.text()); }, // put the data returned from the server in our variable
        function (// put the data returned from the server in our variable
            error) { return console.log("Error HTTP Post Service"); }, // in case of failure show this message
        function () { return console.log("Job Done Post !"); } //run this code in all cases
        );
    };
    RegisterComponent.prototype.handleResponse = function (data) {
        try {
            console.log(data);
            data = JSON.parse(data);
            if (data && data.success) {
                this.setSuccess(data.message);
            }
            else {
                this.setError(data.message);
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    RegisterComponent.prototype.isValid = function () {
        var ok = true;
        ok = ok && (this.inputName && this.inputName.length > 1);
        ok = ok && (this.inputEmail && this.inputEmail.length > 1);
        ok = ok && (this.inputPassword && this.inputPassword.length > 1 && this.inputPassword == this.inputPassword2);
        return ok;
    };
    return RegisterComponent;
}());
RegisterComponent = __decorate([
    core_1.Component({
        template: "\n\n  <h3>Register</h3>\n  <div class=\"card\">\n    <div class=\"card-block\">\n      <h2 class=\"card-title\">Create a new account</h2>\n      <form>\n        <div class=\"form-group row\">\n          <label for=\"inputName\" class=\"col-sm-2 col-form-label\">Full Name</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" [(ngModel)]=\"inputName\" class=\"form-control\" name=\"inputName\" id=\"inputName\" placeholder=\"John Smith\">\n          </div>\n        </div>\n        <div class=\"form-group row\">\n          <label for=\"inputEmail\" class=\"col-sm-2 col-form-label\">Email</label>\n          <div class=\"col-sm-10\">\n            <input type=\"email\" [(ngModel)]=\"inputEmail\" class=\"form-control\" name=\"inputemail\" id=\"inputEmail\" placeholder=\"example@gmail.com\">\n          </div>\n        </div>\n        <div class=\"form-group row\">\n          <label for=\"inputPassword\" class=\"col-sm-2 col-form-label\">Password</label>\n          <div class=\"col-sm-10\">\n            <input type=\"password\" [(ngModel)]=\"inputPassword\" class=\"form-control\" name=\"inputpw\" id=\"inputPassword\" placeholder=\"*******\">\n          </div>\n        </div>\n        <div class=\"form-group row\">\n          <label for=\"inputPassword2\"  class=\"col-sm-2 col-form-label\">Confirm</label>\n          <div class=\"col-sm-10\">\n            <input type=\"password\" class=\"form-control\"  [(ngModel)]=\"inputPassword2\"  id=\"inputPassword2\" name=\"inputpw\" placeholder=\"Confirm Password\">\n          </div>\n        </div>\n        <div class=\"alert alert-danger\" role=\"alert\" *ngIf=\"errorMessage\">{{errorMessage}}</div>\n        <div class=\"alert alert-success\" role=\"alert\" *ngIf=\"successMessage\">{{successMessage}}</div>\n        <div class=\"form-group row\">\n          <div class=\"offset-sm-2 col-sm-10\">\n            <button (click)=\"register()\" [disabled]=\"!isValid()\" class=\"btn btn-primary\">Create Account</button>\n          </div>\n\n        </div>\n      </form>\n    </div>\n  </div>\n  "
    }),
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], RegisterComponent);
exports.RegisterComponent = RegisterComponent;
//# sourceMappingURL=register.component.js.map