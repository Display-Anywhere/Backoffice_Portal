import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FileUploadModule } from 'ng2-file-upload';
import { CommonComponentsRoutes } from './components.rotute';
import { LayoutModule } from "@progress/kendo-angular-layout";
import { ScrollViewModule } from '@progress/kendo-angular-scrollview';
import { InputsModule } from "@progress/kendo-angular-inputs";
import { LabelModule } from "@progress/kendo-angular-label";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { NavigationModule } from "@progress/kendo-angular-navigation";
import { ExcelModule, GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { MenusModule } from "@progress/kendo-angular-menu";
import { ICON_SETTINGS, IconSettingsService, IconsModule, SVGIconModule } from "@progress/kendo-angular-icons";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";

import { MediaLibraryWithTabComponent } from './media-library-with-tab/media-library-with-tab.component';
import { AuthGuard } from 'app/auth/auth.guard';
import { ToastrModule } from 'ngx-toastr';
import { MasterscheduleComponent } from './masterschedule/masterschedule.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EditmasterscheduleComponent } from './editmasterschedule/editmasterschedule.component';
import { TokenInfoComponent } from './token-info/token-info.component';
import { PlaylistsTitlesDownloadStatusComponent } from './playlists-titles-download-status/playlists-titles-download-status.component';
import { SignageContentUploadComponent } from './signage-content-upload/signage-content-upload.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ViewContentComponent } from './view-content/view-content.component';
import { ClientPlayerListComponent } from './client-player-list/client-player-list.component';
import { ManagegroupsComponent } from './managegroups/managegroups.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { DComponent } from './d/d.component';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { AdPlaylistsComponent } from './ad-playlists/ad-playlists.component';
import { NormaladComponent } from './normalad/normalad.component';
import { InstantMobileComponent } from './instant-mobile/instant-mobile.component';
import { UsersComponent } from './users/users.component';
import { UploadsModule } from "@progress/kendo-angular-upload";
import { KpnchannelComponent } from './kpnchannel/kpnchannel.component';
import { DownloadTemplateComponent } from './download-template/download-template.component';
import { MasterscheduleNormaladComponent } from './masterschedule-normalad/masterschedule-normalad.component';
import { TemplateUrlComponent } from './template-url/template-url.component';
import { CommonsearchComponent } from './commonsearch/commonsearch.component';
import { CustomerRegistrationComponent } from './customer-registration/customer-registration.component';
import { CopydataComponent } from './copydata/copydata.component';
import { MasterscheduleAdPlaylistsComponent } from './masterschedule-ad-playlists/masterschedule-ad-playlists.component';
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
  declarations: [  MediaLibraryWithTabComponent,MasterscheduleComponent,EditmasterscheduleComponent,
    TokenInfoComponent,PlaylistsTitlesDownloadStatusComponent,SignageContentUploadComponent,ViewContentComponent,
    ClientPlayerListComponent,ManagegroupsComponent, CustomerDashboardComponent, DComponent,AdPlaylistsComponent, NormaladComponent, InstantMobileComponent, UsersComponent, KpnchannelComponent, DownloadTemplateComponent, MasterscheduleNormaladComponent,TemplateUrlComponent, CommonsearchComponent, CustomerRegistrationComponent, CopydataComponent, MasterscheduleAdPlaylistsComponent
],
 
  exports: [
    CommonModule,
    MediaLibraryWithTabComponent,ManagegroupsComponent,
    MasterscheduleComponent,ViewContentComponent,ClientPlayerListComponent,CustomerDashboardComponent,
    EditmasterscheduleComponent,TokenInfoComponent,PlaylistsTitlesDownloadStatusComponent,SignageContentUploadComponent,CommonsearchComponent
  ],
    imports: [
    CommonModule,
    RouterModule.forChild(CommonComponentsRoutes),
    NgbModule,
    UploadsModule, 
    ReactiveFormsModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    FileUploadModule,
    LayoutModule,
    IconsModule,
    InputsModule,
    LabelModule,
    ButtonsModule,
    NavigationModule,
    GridModule,
    PDFModule,
    ExcelModule,
    MenusModule,
    DropDownsModule,
    ScrollViewModule,
    SVGIconModule,
    DateInputsModule,FuseLoadingBarComponent,
    ToastrModule.forRoot({timeOut: 900,positionClass: 'toast-top-center'}),FontAwesomeModule
  ],
  providers:[AuthGuard
  ],
  
})
export class ComponentsModule { }
/*
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB8QxAguyrwBCX_eApLymamjHYyjlJKD0g'
    })

*/