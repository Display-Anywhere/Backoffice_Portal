import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxLoadingModule  } from 'ngx-loading';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FileUploadModule} from 'ng2-file-upload';

import {ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { StreamingComponent } from './streaming.component';
import { StreamingRoutes } from './streaming.routes';

@NgModule({
  declarations: [StreamingComponent],
  exports:[StreamingComponent],
  imports: [
    RouterModule.forChild(StreamingRoutes),
    CommonModule,
    NgxLoadingModule.forRoot({}),
    NgbModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    FileUploadModule,
  ]
})
export class StreamingModule { }
