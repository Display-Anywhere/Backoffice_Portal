import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxLoadingModule  } from 'ngx-loading';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import {ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { InstantPlayComponent } from './instant-play.component';
import { InstantPlayRoutes } from './instant-play.routes';


@NgModule({
  declarations: [InstantPlayComponent],
  exports:[InstantPlayComponent],
  imports: [
    RouterModule.forChild(InstantPlayRoutes),
    CommonModule,
    NgxLoadingModule.forRoot({}),
    NgbModule,
    Ng2SearchPipeModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class InstantPlayModule { }
