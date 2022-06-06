import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxLoadingModule  } from 'ngx-loading';

import {ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { LoginComponent } from './login.component';
import { LoginRoutes } from './login.routes';


@NgModule({
  declarations: [LoginComponent],
  exports:[LoginComponent],
  imports: [
    RouterModule.forChild(LoginRoutes),
    CommonModule,
    NgxLoadingModule.forRoot({}),
     
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class LoginModule { }
