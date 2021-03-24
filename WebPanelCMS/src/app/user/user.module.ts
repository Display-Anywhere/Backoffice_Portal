import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxLoadingModule  } from 'ngx-loading';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import {ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { UserComponent } from './user.component';
import { UserRoutes } from './user.routes';
import { NgbdSortableHeader_User } from './user_sortable.directive';


@NgModule({
  declarations: [UserComponent,NgbdSortableHeader_User],
  exports:[UserComponent],
  imports: [
    RouterModule.forChild(UserRoutes),
    CommonModule,
    NgxLoadingModule.forRoot({}),
    NgbModule,
    Ng2SearchPipeModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class UserModule { }
