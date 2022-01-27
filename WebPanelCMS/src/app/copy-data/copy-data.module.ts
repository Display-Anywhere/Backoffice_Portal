import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxLoadingModule  } from 'ngx-loading';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import {ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { CopyDataComponent } from './copy-data.component';
import { CopyDataRoutes } from './copy-data.routes';
import { NgbdSortableHeader_CopyData } from '../directive/copydata_sortable.directive';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
@NgModule({
  declarations: [CopyDataComponent,NgbdSortableHeader_CopyData],
  exports:[CopyDataComponent],
  imports: [
    RouterModule.forChild(CopyDataRoutes),
    CommonModule,
    NgxLoadingModule.forRoot({}),
    NgbModule,
    Ng2SearchPipeModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  providers: [DecimalPipe],
})
export class CopyDataModule { }
