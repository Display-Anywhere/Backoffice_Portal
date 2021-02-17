import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerDashboardComponent } from './customer-dashboard.component';
import { CustomerDashboardRoutes } from './customer-dashboard.routes';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLoadingModule  } from 'ngx-loading';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {ReactiveFormsModule,FormsModule  } from '@angular/forms';


import { ComponentsModule } from '../components/components.module';
import { NgbdSortableHeader_Dashboard } from './dashboard_sortable.directive';
@NgModule({
  declarations: [CustomerDashboardComponent,NgbdSortableHeader_Dashboard],
  exports:[CustomerDashboardComponent],
  imports: [
    RouterModule.forChild(CustomerDashboardRoutes),
    CommonModule,
    NgxLoadingModule.forRoot({}),
    NgbModule,
    Ng2SearchPipeModule,
    //MenuListModule, 
    //TokenInfoModule
    //PlayerLogModule
    ReactiveFormsModule,FormsModule,
    ComponentsModule
  ]
})
export class CustomerDashboardModule { }
