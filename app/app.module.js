"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var animations_1 = require("@angular/platform-browser/animations");
var http_1 = require("@angular/http");
var angular2_jwt_1 = require("angular2-jwt");
var auth_guard_1 = require("./auth/guard/auth.guard");
var app_component_1 = require("./app.component");
var register_component_1 = require("./auth/register.component");
var home_component_1 = require("./home.component");
var stats_component_1 = require("./stats/stats.component");
var player_component_1 = require("./stats/player.component");
var createPool_component_1 = require("./pool/createPool.component");
var unauthorized_component_1 = require("./auth/unauthorized.component");
var myPools_component_1 = require("./pool/myPools.component");
var poolView_component_1 = require("./pool/poolView.component");
var poolAccountView_component_1 = require("./pool/poolAccountView.component");
var myAccount_component_1 = require("./account/myAccount.component");
var main_component_1 = require("./pool/main.component");
var pool_service_1 = require("./service/pool.service");
var routes_1 = require("./routes/routes");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            animations_1.BrowserAnimationsModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            http_1.JsonpModule,
            routes_1.routing
        ],
        providers: [
            angular2_jwt_1.AUTH_PROVIDERS, auth_guard_1.AuthGuard, pool_service_1.PoolService, { provide: common_1.LocationStrategy, useClass: common_1.HashLocationStrategy }
        ],
        declarations: [app_component_1.AppComponent,
            main_component_1.MainComponent,
            home_component_1.HomeComponent,
            register_component_1.RegisterComponent,
            stats_component_1.StatsComponent,
            player_component_1.PlayerComponent,
            unauthorized_component_1.UnauthorizedComponent,
            createPool_component_1.CreatePoolComponent,
            myPools_component_1.MyPoolsComponent,
            poolView_component_1.PoolViewComponent,
            poolAccountView_component_1.PoolAccountViewComponent,
            myAccount_component_1.MyAccountComponent
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map