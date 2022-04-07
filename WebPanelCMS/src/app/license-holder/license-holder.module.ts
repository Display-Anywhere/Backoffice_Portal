import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LicenseHolderComponent } from './license-holder.component';
import { LicenseHolderRoutes } from './license-holder.routes';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLoadingModule  } from 'ngx-loading';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {  MomentDateTimeAdapter } from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time-adapter.class';
import {ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DataTablesModule } from 'angular-datatables';  
import { NgbdSortableHeaderOpening } from './opensortable.directive';
import { 
  OwlDateTimeModule, 
  OwlNativeDateTimeModule ,OWL_DATE_TIME_FORMATS,OWL_DATE_TIME_LOCALE ,DateTimeAdapter
} from 'ng-pick-datetime';
export const MY_CUSTOM_FORMATS = {
  parseInput: 'LL LT',
  fullPickerInput: 'LL LT',
  datePickerInput: 'DD-MMM-YYYY',
  timePickerInput: 'HH:mm',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMM YYYY',
};
@NgModule({
  declarations: [LicenseHolderComponent, NgbdSortableHeaderOpening],
  exports:[LicenseHolderComponent],
  imports: [
    RouterModule.forChild(LicenseHolderRoutes),
    CommonModule,
    NgxLoadingModule.forRoot({}),
    NgbModule,
    Ng2SearchPipeModule,
    NgMultiSelectDropDownModule.forRoot(),
    //MenuListModule, 
    //TokenInfoModule
    //PlayerLogModule
     
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    DataTablesModule,
    NgbNavModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  providers:[{provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},
  {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS}]
})
export class LicenseHolderModule { }
