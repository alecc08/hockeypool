import {HomeComponent} from "../home.component";
import {StatsComponent} from "../stats/stats.component";
import {RegisterComponent} from "../auth/register.component";
import { PlayerComponent } from "../stats/player.component";
import {UnauthorizedComponent} from "../auth/unauthorized.component";
import {CreatePoolComponent} from "../pool/createPool.component";
import {MyPoolsComponent} from "../pool/myPools.component";
import {PoolViewComponent} from "../pool/poolView.component";
import {PoolAccountViewComponent} from "../pool/poolAccountView.component";
import {MyAccountComponent} from "../account/myAccount.component";
import {MainComponent} from "../pool/main.component";
import {AuthGuard} from "../auth/guard/auth.guard";


import { Routes, RouterModule } from '@angular/router';

// Route config let's you map routes to components
const routes: Routes = [
  // map '/persons' to the people list component
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'stats',
    component: StatsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'account',
    component: MyAccountComponent
  },
  {
    path: 'pool/create',
    component: CreatePoolComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pool/view',
    component: MyPoolsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pool/view/:id',
    component: PoolViewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pool/view/:id/account/:accountId',
    component: PoolAccountViewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'player/:name',
    component: PlayerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: '*',
    redirectTo: '/'
  }
];

export const routing = RouterModule.forRoot(routes);
