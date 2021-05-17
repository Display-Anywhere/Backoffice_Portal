import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxLoadingModule  } from 'ngx-loading';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import {ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { AdminLogsComponent } from './admin-logs.component';
import { AdminLogsRoutes } from './admin-logs.routes';
import { DataTablesModule } from 'angular-datatables';
@NgModule({
  declarations: [AdminLogsComponent],
  exports:[AdminLogsComponent],
  imports: [
    RouterModule.forChild(AdminLogsRoutes),
    CommonModule,
    NgxLoadingModule.forRoot({}),
    NgbModule,
    Ng2SearchPipeModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    DataTablesModule
  ]
})
export class AdminLogsModule { }
