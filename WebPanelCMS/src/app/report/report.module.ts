import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgxLoadingModule  } from 'ngx-loading';

import {ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { ReportComponent } from './report.component';
import { ReportRoutes } from './report.routes';


@NgModule({
  declarations: [ReportComponent],
  exports:[ReportComponent],
  imports: [
    RouterModule.forChild(ReportRoutes),
    CommonModule,
    NgxLoadingModule.forRoot({}),
     
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class ReportModule { }
