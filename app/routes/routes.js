"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var home_component_1 = require("../home.component");
var stats_component_1 = require("../stats/stats.component");
var register_component_1 = require("../auth/register.component");
var player_component_1 = require("../stats/player.component");
var unauthorized_component_1 = require("../auth/unauthorized.component");
var createPool_component_1 = require("../pool/createPool.component");
var myPools_component_1 = require("../pool/myPools.component");
var poolView_component_1 = require("../pool/poolView.component");
var poolAccountView_component_1 = require("../pool/poolAccountView.component");
var myAccount_component_1 = require("../account/myAccount.component");
var main_component_1 = require("../pool/main.component");
var auth_guard_1 = require("../auth/guard/auth.guard");
var router_1 = require("@angular/router");
// Route config let's you map routes to components
var routes = [
    // map '/persons' to the people list component
    {
        path: '',
        component: main_component_1.MainComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'home',
        component: home_component_1.HomeComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'stats',
        component: stats_component_1.StatsComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'register',
        component: register_component_1.RegisterComponent
    },
    {
        path: 'account',
        component: myAccount_component_1.MyAccountComponent
    },
    {
        path: 'pool/create',
        component: createPool_component_1.CreatePoolComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'pool/view',
        component: myPools_component_1.MyPoolsComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'pool/view/:id',
        component: poolView_component_1.PoolViewComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'pool/view/:id/account/:accountId',
        component: poolAccountView_component_1.PoolAccountViewComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'player/:name',
        component: player_component_1.PlayerComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'unauthorized',
        component: unauthorized_component_1.UnauthorizedComponent
    },
    {
        path: '*',
        redirectTo: '/'
    }
];
exports.routing = router_1.RouterModule.forRoot(routes);
//# sourceMappingURL=routes.js.map