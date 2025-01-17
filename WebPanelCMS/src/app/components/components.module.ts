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
//import { OwlMomentDateTimeModule } from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { HoteltvPlayedLogsComponent } from './hoteltv-played-logs/hoteltv-played-logs.component';
import { LoginSbitComponent } from './login-sbit/login-sbit.component';
import { KpnChannelsComponent } from './kpn-channels/kpn-channels.component';
import { SanitizerLogsComponent } from './sanitizer-logs/sanitizer-logs.component';
import { KpnSummaryComponent } from './kpn-summary/kpn-summary.component';
import { JoanDevicesComponent } from './joan-devices/joan-devices.component';
import { LoginDisplayAnyWhereComponent } from './login-display-any-where/login-display-any-where.component';
import { EventScheduleComponent } from './event-schedule/event-schedule.component';
import { PlayedAdLogComponent } from './played-ad-log/played-ad-log.component';
import { LoginDMComponent } from './login-dm/login-dm.component';
import { SqueezeRssComponent } from './squeeze-rss/squeeze-rss.component';
import { SqueezeAssginRssComponent } from './squeeze-assgin-rss/squeeze-assgin-rss.component';
import { InfoMainComponent } from './info-main/info-main.component';
import { PlaylistLibraryModule } from '../playlist-library/playlist-library.module';
import { PlaylistLibraryComponent } from './playlist-library/playlist-library.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MediaLibraryComponent } from './media-library/media-library.component';
import { LayoutModule } from "@progress/kendo-angular-layout";
import { ScrollViewModule } from '@progress/kendo-angular-scrollview';
import { InputsModule } from "@progress/kendo-angular-inputs";
import { LabelModule } from "@progress/kendo-angular-label";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { NavigationModule } from "@progress/kendo-angular-navigation";
import { ExcelModule, GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { MenusModule } from "@progress/kendo-angular-menu";
import { ICON_SETTINGS } from "@progress/kendo-angular-icons";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { MasterscheduleComponent } from './masterschedule/masterschedule.component';
import { SignageContentUploadComponent } from './signage-content-upload/signage-content-upload.component';
import { EditmasterscheduleComponent } from './editmasterschedule/editmasterschedule.component';
import { MediaLibraryWithTabComponent } from './media-library-with-tab/media-library-with-tab.component';
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
PlayeractivationlogComponent,
HoteltvPlayedLogsComponent,
LoginSbitComponent,
KpnChannelsComponent,
SanitizerLogsComponent,
KpnSummaryComponent,
JoanDevicesComponent,
LoginDisplayAnyWhereComponent,
EventScheduleComponent,
PlayedAdLogComponent,
LoginDMComponent,
SqueezeRssComponent,
SqueezeAssginRssComponent,
InfoMainComponent,
PlaylistLibraryComponent,
MediaLibraryComponent,
MasterscheduleComponent,
SignageContentUploadComponent,
EditmasterscheduleComponent,
MediaLibraryWithTabComponent
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
PlayeractivationlogComponent,
HoteltvPlayedLogsComponent,
LoginSbitComponent,
SanitizerLogsComponent,
KpnSummaryComponent,
JoanDevicesComponent,
LoginDisplayAnyWhereComponent,
EventScheduleComponent,
PlayedAdLogComponent,
LoginDMComponent,
SqueezeRssComponent,
SqueezeAssginRssComponent,
InfoMainComponent,
PlaylistLibraryComponent,
MediaLibraryComponent,
SignageContentUploadComponent,
MasterscheduleComponent,
EditmasterscheduleComponent,
MediaLibraryWithTabComponent
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
    ColorPickerModule,
    InfiniteScrollModule,
    ScrollViewModule,
    LayoutModule,
    InputsModule,
    LabelModule,
    ButtonsModule,
    NavigationModule,
    GridModule,
    PDFModule,
    ExcelModule,
    MenusModule,
    DropDownsModule
  ],
  providers:[{provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},
  {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS},
  { provide: ICON_SETTINGS, useValue: { type: "font", size: "medium" } }]
})
export class ComponentsModule { }
/*
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB8QxAguyrwBCX_eApLymamjHYyjlJKD0g'
    })

*/