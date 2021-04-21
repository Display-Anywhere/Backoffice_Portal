import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerLogComponent } from './player-log/player-log.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLoadingModule  } from 'ngx-loading';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { 
  OwlDateTimeModule, 
  OwlNativeDateTimeModule ,OWL_DATE_TIME_FORMATS,OWL_DATE_TIME_LOCALE ,DateTimeAdapter
} from 'ng-pick-datetime';
import {  MomentDateTimeAdapter } from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time-adapter.class';
import { TokenInfoComponent } from './token-info/token-info.component';
import { NewPlaylistLibraryComponent } from './new-playlist-library/new-playlist-library.component';
import { RepTitleSummaryComponent } from './rep-title-summary/rep-title-summary.component';
import { RepTokenInfoComponent } from './rep-token-info/rep-token-info.component';
import { RepTokenPlayedSongComponent } from './rep-token-played-song/rep-token-played-song.component';
import { DataTablesModule } from 'angular-datatables';
import { RepMachineLogsComponent } from './rep-machine-logs/rep-machine-logs.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { RepMachineDispenserChangeLogComponent } from './rep-machine-dispenser-change-log/rep-machine-dispenser-change-log.component';
import { TransferContentComponent } from './transfer-content/transfer-content.component';
import { AdPlaylistsComponent } from './ad-playlists/ad-playlists.component';
import { KeyboardannouncementComponent } from './keyboardannouncement/keyboardannouncement.component';
import { MachineAnnouncementComponent } from './machine-announcement/machine-announcement.component';
import { PrayerComponent } from './prayer/prayer.component';
import { EmergencyAlertComponent } from './emergency-alert/emergency-alert.component';
import { DownloadTemplateComponent } from './download-template/download-template.component';
import { UploadComponent } from './upload/upload.component';
import { FileUploadModule } from 'ng2-file-upload';
import { CopyContentComponent } from './copy-content/copy-content.component';
import { PercentageScheduleComponent } from './percentage-schedule/percentage-schedule.component';
import { CopysanitizerannouncementComponent } from './copysanitizerannouncement/copysanitizerannouncement.component';
import { ManagegroupsComponent } from './managegroups/managegroups.component';
import { NgbdSortableHeader } from './sortable.directive';
import { OpeninghourComponent } from './openinghour/openinghour.component';
import { OfflineAlertComponent } from './offline-alert/offline-alert.component';
import { DownloadsensortemplateComponent } from './downloadsensortemplate/downloadsensortemplate.component';
import { TemplateUrlComponent } from './template-url/template-url.component';
//import { OwlMomentDateTimeModule } from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time.module';
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
  declarations: [  PlayerLogComponent ,
  TokenInfoComponent,
NewPlaylistLibraryComponent ,
RepTitleSummaryComponent,
RepTokenInfoComponent,
RepTokenPlayedSongComponent,
RepMachineLogsComponent,
RepMachineDispenserChangeLogComponent,
TransferContentComponent,
AdPlaylistsComponent,
KeyboardannouncementComponent,
MachineAnnouncementComponent,
PrayerComponent,
EmergencyAlertComponent,
DownloadTemplateComponent,
UploadComponent,
CopyContentComponent,
PercentageScheduleComponent,
CopysanitizerannouncementComponent,
ManagegroupsComponent,
NgbdSortableHeader,
OpeninghourComponent,
OfflineAlertComponent,
DownloadsensortemplateComponent,
TemplateUrlComponent
],
 
  exports: [
    CommonModule,
    PlayerLogComponent,
    TokenInfoComponent,
    NewPlaylistLibraryComponent,
    RepTitleSummaryComponent,
RepTokenInfoComponent,
RepTokenPlayedSongComponent,
RepMachineLogsComponent,
RepMachineDispenserChangeLogComponent,
TransferContentComponent,
AdPlaylistsComponent,
KeyboardannouncementComponent,
MachineAnnouncementComponent,
PrayerComponent,
EmergencyAlertComponent,
DownloadTemplateComponent,
UploadComponent,
CopyContentComponent,
PercentageScheduleComponent,
CopysanitizerannouncementComponent,
ManagegroupsComponent,
OpeninghourComponent,
OfflineAlertComponent,
DownloadsensortemplateComponent
  ],
    imports: [
    CommonModule,
    NgxLoadingModule.forRoot({}),
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    Ng2SearchPipeModule,
    DataTablesModule,
    NgMultiSelectDropDownModule.forRoot(),
    FileUploadModule
  ],
  providers:[{provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},
  {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS}]
})
export class ComponentsModule { }
