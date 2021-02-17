import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxLoadingModule  } from 'ngx-loading';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FileUploadModule} from 'ng2-file-upload';

import {ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { UploadContentComponent } from './upload-content.component';
import { UploadContentRoutes } from './upload-content.routes';

@NgModule({
  declarations: [UploadContentComponent],
  exports:[UploadContentComponent],
  imports: [
    RouterModule.forChild(UploadContentRoutes),
    CommonModule,
    NgxLoadingModule.forRoot({}),
    NgbModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    FileUploadModule,
  ]
})
export class UploadContentModule { }
