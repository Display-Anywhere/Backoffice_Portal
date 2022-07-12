import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxLoadingModule  } from 'ngx-loading';

import {ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { AuthorizeSSOComponent } from './authorize-sso.component';
import { AuthorizeSSORoutes } from './login.routes';


@NgModule({
  declarations: [AuthorizeSSOComponent],
  exports:[AuthorizeSSOComponent],
  imports: [
    RouterModule.forChild(AuthorizeSSORoutes),
    CommonModule,
    NgxLoadingModule.forRoot({}),
     
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class AuthorizeSSOModule { }
