import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerLogComponent } from './player-log/player-log.component';
import { RouterModule } from '@angular/router';
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
import { ViewContentComponent } from './view-content/view-content.component';
import { AssignvideoclipsComponent } from './assignvideoclips/assignvideoclips.component';
import { AdminLogsComponent } from './admin-logs/admin-logs.component';
import { InstantMobileComponent } from './instant-mobile/instant-mobile.component';
import { Converthtmlmp4Component } from './converthtmlmp4/converthtmlmp4.component';
import { NgProgressModule } from "ngx-progressbar";
import { NgProgressHttpModule } from "ngx-progressbar/http";
import { TempScheduleComponent } from './temp-schedule/temp-schedule.component';
import { NormalscheduleComponent } from './normalschedule/normalschedule.component';
import { PlayerIPAddressLogsComponent } from './player-ipaddress-logs/player-ipaddress-logs.component';
import { PlaylistsTitlesDownloadStatusComponent } from './playlists-titles-download-status/playlists-titles-download-status.component';
import { ClientcontentblockComponent } from './clientcontentblock/clientcontentblock.component';
import { PhilipsinfoComponent } from './philipsinfo/philipsinfo.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { MytemplateComponent } from './mytemplate/mytemplate.component';
import { EditTemplateComponent } from './edit-template/edit-template.component';
import { CommonComponentsRoutes } from './components.rotute';
import { AssigncustomersComponent } from './assigncustomers/assigncustomers.component';
import { PlayeractivationlogComponent } from './playeractivationlog/playeractivationlog.component';
import { AgmCoreModule } from '@agm/core';

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
TemplateUrlComponent,
ViewContentComponent,
AssignvideoclipsComponent,
AdminLogsComponent,
InstantMobileComponent,
Converthtmlmp4Component,
TempScheduleComponent,
NormalscheduleComponent,
PlayerIPAddressLogsComponent,
PlaylistsTitlesDownloadStatusComponent,
ClientcontentblockComponent,
PhilipsinfoComponent,
TemplateListComponent,
MytemplateComponent,
EditTemplateComponent,
AssigncustomersComponent,
PlayeractivationlogComponent
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
DownloadsensortemplateComponent,
ViewContentComponent,
AdminLogsComponent,
InstantMobileComponent,
Converthtmlmp4Component,
TempScheduleComponent,
NormalscheduleComponent,
PlayerIPAddressLogsComponent,
TemplateUrlComponent,
PlaylistsTitlesDownloadStatusComponent,
ClientcontentblockComponent,
PhilipsinfoComponent,
TemplateListComponent,
AssigncustomersComponent,
PlayeractivationlogComponent
  ],
    imports: [
    CommonModule,
    RouterModule.forChild(CommonComponentsRoutes),
    NgxLoadingModule.forRoot({}),
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    Ng2SearchPipeModule,
    DataTablesModule,
    NgMultiSelectDropDownModule.forRoot(),
    FileUploadModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB8QxAguyrwBCX_eApLymamjHYyjlJKD0g'
    })
  ],
  providers:[{provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},
  {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS}]
})
export class ComponentsModule { }
