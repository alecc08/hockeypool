import { NgModule }      from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpModule, JsonpModule } from '@angular/http';

import { AUTH_PROVIDERS } from 'angular2-jwt';
import { AuthGuard } from './auth/guard/auth.guard';

import { AppComponent }   from './app.component';
import { RegisterComponent }   from './auth/register.component';
import { HomeComponent } from './home.component';
import { StatsComponent } from './stats/stats.component';
import { PlayerComponent } from './stats/player.component';
import { CreatePoolComponent } from './pool/createPool.component';
import { UnauthorizedComponent } from './auth/unauthorized.component';
import { MyPoolsComponent } from './pool/myPools.component';
import { PoolViewComponent } from './pool/poolView.component';
import { PoolAccountViewComponent } from './pool/poolAccountView.component';
import { MyAccountComponent} from './account/myAccount.component';
import { MainComponent } from './pool/main.component';

import { PoolService } from './service/pool.service';

import { routing } from './routes/routes';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    routing
  ],
  providers: [
    AUTH_PROVIDERS, AuthGuard, PoolService, {provide: LocationStrategy, useClass:HashLocationStrategy}
  ],
  declarations: [ AppComponent,
    MainComponent,
    HomeComponent,
    RegisterComponent,
    StatsComponent,
    PlayerComponent,
    UnauthorizedComponent,
    CreatePoolComponent,
    MyPoolsComponent,
    PoolViewComponent,
    PoolAccountViewComponent,
    MyAccountComponent
     ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
