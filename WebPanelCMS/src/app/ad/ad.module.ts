import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxLoadingModule  } from 'ngx-loading';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FileUploadModule} from 'ng2-file-upload';

import {ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { AdComponent } from './ad.component';
import { AdRoutes } from './ad.routes';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { 
  OwlDateTimeModule, 
  OwlNativeDateTimeModule ,OWL_DATE_TIME_FORMATS,OWL_DATE_TIME_LOCALE ,DateTimeAdapter
} from 'ng-pick-datetime';
import {  MomentDateTimeAdapter } from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time-adapter.class';
import { DComponent } from '../d/d.component';
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
  declarations: [DComponent],
  exports:[DComponent],
  imports: [
    RouterModule.forChild(AdRoutes),
    CommonModule,
    NgxLoadingModule.forRoot({}),
    NgbModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    FileUploadModule,
    NgMultiSelectDropDownModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers:[{provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},
  {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS}]
})
export class AdModule { }
