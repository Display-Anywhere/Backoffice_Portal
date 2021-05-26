import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxLoadingModule  } from 'ngx-loading';

import {ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { ManualComponent } from './manual.component';
import { ManualRoutes } from './manual.routes';

@NgModule({
  declarations: [ManualComponent],
  exports:[ManualComponent],
  imports: [
    RouterModule.forChild(ManualRoutes),
    CommonModule,
    NgxLoadingModule.forRoot({}),
     
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class ManualModule { }
