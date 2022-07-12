import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AuthGuard } from './auth/auth.guard';
import { ComponentsModule } from './components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
//import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup

import { MomentModule } from 'angular2-moment';
import { AuthModule } from '@auth0/auth0-angular';





@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AuthModule.forRoot({
      domain: 'dev-06g1v0jg.eu.auth0.com',
      clientId: '0CCBObxDuOAu07CB0UA2hmaIRloMB3BD'
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot({timeOut: 900,positionClass: 'toast-top-center'}),
    NgbModule,
    AppRoutingModule ,
    ComponentsModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    NgxLoadingModule.forRoot({}),
    MomentModule,
    
      ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
