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
import { ExcelModule, GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { 
  OwlDateTimeModule, 
  OwlNativeDateTimeModule ,OWL_DATE_TIME_FORMATS,OWL_DATE_TIME_LOCALE ,DateTimeAdapter
} from 'ng-pick-datetime';
import { ClientPlayerListComponent } from './client-player-list/client-player-list.component';
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
  declarations: [LicenseHolderComponent, NgbdSortableHeaderOpening, ClientPlayerListComponent],
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
    GridModule,
    PDFModule,
    ExcelModule,
    DropDownsModule,
    ButtonsModule,
    InputsModule,
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
