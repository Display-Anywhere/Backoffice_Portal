import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LinksComponent } from './links.component';
import { NgxLoadingModule  } from 'ngx-loading';

import {ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { LinksRoutes } from './links.routes';

@NgModule({
  declarations: [LinksComponent],
  exports:[LinksComponent],
  imports: [
    RouterModule.forChild(LinksRoutes),
    CommonModule,
    NgxLoadingModule.forRoot({}),
     
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class LinksModule { }
