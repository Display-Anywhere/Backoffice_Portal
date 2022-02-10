export class ConfigAPI {
  //private Host = 'http://live.advikon.com/api/';
    private Host: string = "https://api.nusign.eu/api/";
   //private Host: string = "https://panelapi.advikon.com/api/";
   //private Host: string = "http://localhost:60328/api/";
   //private Host_panel: string = "https://api.advikon.com/api/";
   //private Host_panel: string = "http://localhost:60328/api/";

   FillQueryCombo: string = this.Host + 'FillQueryCombo';
   FillTokenInfo: string = this.Host + 'FillTokenInfo';
   FillTokenContent: string = this.Host + 'FillTokenContent';
   SaveTokenInformation: string = this.Host + 'SaveTokenInformation';
   ResetToken: string = this.Host + 'ResetToken';
   UpdateTokenSchedule: string = this.Host + 'UpdateTokenSchedule';
   FillCustomer: string = this.Host + 'FillCustomer';
   SaveCustomer: string = this.Host + 'SaveCustomer';
   EditClickCustomer: string = this.Host + 'EditClickCustomer';
   DeleteCustomer: string = this.Host + 'DeleteCustomer';
   BestOf: string = this.Host + 'BestOf';
   PlaylistSong: string = this.Host + 'PlaylistSong';
   SaveBestPlaylist: string = this.Host + 'SaveBestPlaylist';
   AddPlaylistSong: string = this.Host + 'AddPlaylistSong';
   CommanSearch: string = this.Host + 'CommanSearch';
   DeleteTitle: string = this.Host + 'DeleteTitle';
   SavePlaylist: string = this.Host + 'SavePlaylist';
   SavePlaylistFromBestOf: string = this.Host + 'SavePlaylistFromBestOf';
   Playlist: string = this.Host + 'Playlist';
   SongList: string = this.Host + 'SongList';
   SaveSF: string = this.Host + 'SaveSF_New';
   FillSF: string = this.Host + 'FillSF';
   DeleteTokenSch: string = this.Host + 'DeleteTokenSch';
   FillSearchAds: string = this.Host + 'FillSearchAds';
   FillTokenInfoAds: string = this.Host + 'FillTokenInfoAds';
   FillSaveAds: string = this.Host + 'FillSaveAds';
   UpdateAds: string = this.Host + 'UpdateAds';
   SaveAdsAndUploadFile: string = this.Host + 'SaveAdsAndUploadFile';
   DeleteAds: string = this.Host + 'DeleteAds';
   SavePrayer: string = this.Host + 'SavePrayer';
   FillSearchPayer: string = this.Host + 'FillSearchPayer';
   DeletePrayer: string = this.Host + 'DeletePrayer';
   uLogin: string = this.Host + 'CustomerLogin';
   PlayerSummary: string = this.Host + 'PlayerSummary';
   GetCustomerTokenDetailSummary: string = this.Host + 'GetCustomerTokenDetailSummary';
   SendNoti: string = this.Host + 'SendNoti';
   GetFCMID: string = this.Host + 'GetFCMID';
   FillUserList: string = this.Host + 'FillUserList';
   EditUser: string = this.Host + 'EditUser';
   DeleteUser: string = this.Host + 'DeleteUser';
   SaveUpdateUser: string = this.Host + 'SaveUpdateUser';
   FillPlayedSongsLog: string = this.Host + 'FillPlayedSongsLog';
   FillPlayedAdsLog: string = this.Host + 'FillPlayedAdsLog';
   CustomerLoginDetail: string = this.Host + 'CustomerLoginDetail';
   DeletePlaylist: string = this.Host + 'DeletePlaylist';
   SaveFormat: string = this.Host + 'SaveFormat';
   SaveCopySchedule: string = this.Host + 'SaveCopySchedule';
   SettingPlaylist: string = this.Host + 'SettingPlaylist';
   UpdatePlaylistSRNo: string = this.Host + 'UpdatePlaylistSRNo';

   UploadImage: string = this.Host + 'UploadImage';
   SaveModifyLogs: string = this.Host + 'SaveModifyLogs';
   FillAdminLogs: string = this.Host + 'FillAdminLogs';
   GetGenreList: string = this.Host + 'GetGenreList';
   NewSavePlaylist: string = this.Host + 'NewSavePlaylist';
   SaveAdPlaylist: string = this.Host + 'SaveAdPlaylist';
   FillAdPlaylist: string = this.Host + 'FillAdPlaylist';
   DeleteFormat: string = this.Host + 'DeleteFormat';
   UpdateAppLogo: string = this.Host + 'UpdateAppLogo';
   SetOnlineIndicator: string = this.Host + 'SetOnlineIndicator';
   ForceUpdate: string = this.Host + 'ForceUpdate';
   // tslint:disable-next-line: variable-name
   FillTokenInfo_formatANDplaylist: string = this.Host + 'FillTokenInfo_formatANDplaylist';
   DeleteLogo: string = this.Host + 'DeleteLogo';
   UploadSheet: string = this.Host + 'UploadSheet';
   SaveGenre: string = this.Host + 'SaveGenre';
   SaveFolder: string = this.Host + 'SaveFolder';
   FillPlayedTitleSummary: string = this.Host + 'FillPlayedTitleSummary';
   SendMail: string = this.Host + 'SendMail';
   CitySateNewModify: string = this.Host + 'CitySateNewModify';
   CopyFormat: string = this.Host + 'CopyFormat';
   SaveTranferToken: string = this.Host + 'SaveTranferToken';
   GetOnlineStream: string = this.Host + 'GetOnlineStream';
   UploadStreamImage: string = this.Host + 'UploadStreamImage';
   UpdateStream: string = this.Host + 'UpdateStream';
   DeleteStream: string = this.Host + 'DeleteStream';
   AssignStream: string = this.Host + 'AssignStream';
   DeleteAssignStream: string = this.Host + 'DeleteAssignStream';
   FillMiddleImage: string = this.Host + 'FillMiddleImage';
   SetMiddleImg: string = this.Host + 'SetMiddleImg';
   DeleteMiddleImg: string = this.Host + 'DeleteMiddleImg';
   FillSignageLogo: string = this.Host + 'FillSignageLogo';
   DeleteTitlePercentage: string = this.Host + 'DeleteTitlePercentage';
   DeletePlaylistAds: string = this.Host + 'DeletePlaylistAds';
   FillMachineLogs: string = this.Host + 'FillMachineLogs';
   GetMachineAnnouncement: string = this.Host + 'GetMachineAnnouncement';
   DeleteMachineTitle: string = this.Host + 'DeleteMachineTitle';
   SaveMachineAnnouncement: string = this.Host + 'SaveMachineAnnouncement';
   UpdateMachineAnnouncementSRNo: string = this.Host + 'UpdateMachineAnnouncementSRNo';
   FillPlayedSanitiserLog: string = this.Host + 'FillPlayedSanitiserLog';
   UpdateEnergyLevel: string = this.Host + 'UpdateEnergyLevel';
   GetFolderContent: string = this.Host + 'GetFolderContent';
   SaveTransferContent: string = this.Host + 'SaveTransferContent';
   UpdateContent: string = this.Host + 'UpdateContent';
   SaveKeyboardAnnouncement: string = this.Host + 'SaveKeyboardAnnouncement';
   GetKeyboardAnnouncement: string = this.Host + 'GetKeyboardAnnouncement';
   DeleteKeyboardAnnouncement: string = this.Host + 'DeleteKeyboardAnnouncement';
   GetClientContenType: string = this.Host + 'GetClientContenType';
   SetFireAlert: string = this.Host + 'SetFireAlert';
   GetFireAlert: string = this.Host + 'GetFireAlert';
   DeleteFireAlert: string = this.Host + 'DeleteFireAlert';
   GetTemplates: string = this.Host + 'GetTemplates';
   DownloadTemplates: string = this.Host + 'DownloadTemplates';
   DownloadTemplates_new: string = this.Host + 'DownloadTemplates_new';
   SaveImageTimeInterval: string = this.Host + 'SaveImageTimeInterval';
   DeleteFolder: string = this.Host + 'DeleteFolder';
   UpdateTokenGroups: string = this.Host + 'UpdateTokenGroups';
   DeleteGroup: string = this.Host + 'DeleteGroup';
   SaveOpeningHours: string = this.Host + 'SaveOpeningHours';
   FillTokenOpeningHours: string = this.Host + 'FillTokenOpeningHours';
   UpdateTokenInfo: string = this.Host + 'UpdateTokenInfo';
   ClientTemplateRegsiter: string = this.Host + 'ClientTemplateRegsiter';
   DeleteTitleOwn: string = this.Host + 'DeleteTitleOwn';
   FillCustomerWithKey: string = this.Host + 'FillCustomerWithKey';
   SaveCopyContent: string = this.Host + 'SaveCopyContent';
   FindToken: string = this.Host + 'FindToken';
   UpdateExpiryDate_Template_Creator: string = this.Host + 'UpdateExpiryDate_Template_Creator';
   SaveRebootTime: string = this.Host + 'SaveRebootTime';
   GetClientFolder: string = this.Host + 'GetClientFolder';
   ReplaceFolderContent: string = this.Host + 'ReplaceFolderContent';

   SaveUpdateOfflineAlert: string = this.Host + 'SaveUpdateOfflineAlert';
   EditOfflineUser: string = this.Host + 'EditOfflineUser';
   FillOfflineAlertList: string = this.Host + 'FillOfflineAlertList';
   SavePlaylistTokenVolume: string = this.Host + 'SavePlaylistTokenVolume';
   DeleteOfflineAlert: string = this.Host + 'DeleteOfflineAlert';
   SaveTemplateUrl: string = this.Host + 'SaveTemplateUrl';
   GetTemplateUrl: string = this.Host + 'GetTemplateUrl';
   DeleteTemplateUrl: string = this.Host + 'DeleteTemplateUrl';
   SaveInstantMobileAnnouncement: string = this.Host + 'SaveInstantMobileAnnouncement';
   GetInstantMobileAnnouncement: string = this.Host + 'GetInstantMobileAnnouncement';
   FillSavePlaylistAds: string = this.Host + 'FillSavePlaylistAds';
   DownloadTemplatesConvertTOMp4: string = this.Host + 'DownloadTemplatesConvertTOMp4';
   SavePlaylistContentExpiry: string = this.Host + 'SavePlaylistContentExpiry';
   SaveFutureSchedule: string = this.Host + 'SaveFutureSchedule';
   FillSF_future: string = this.Host + 'FillSF_future';
   DeleteTokenSch_future: string = this.Host + 'DeleteTokenSch_future';
   GetTokenIpAddressLogs: string = this.Host + 'GetTokenIpAddressLogs';
   GetPlaylistsTitlesDownloadStatus: string = this.Host + 'GetPlaylistsTitlesDownloadStatus';
   GetSplPlaylistDateWiseLive: string = this.Host + 'GetSplPlaylistDateWiseLive';
   GetAdsDownloadStatus: string = this.Host + 'GetAdsDownloadStatus';
   SaveClientContentBlock: string = this.Host + 'SaveClientContentBlock';
   GetClientContentBlock: string = this.Host + 'GetClientContentBlock';
   DeleteClientContentBlock: string = this.Host + 'DeleteClientContentBlock';
   ContentTitleArtistSearch: string = this.Host + 'ContentTitleArtistSearch';
   SavePublishSchedule: string = this.Host + 'SavePublishSchedule';
   SavePublishToken: string = this.Host + 'SavePublishToken';
   GetlatitudeANDlongitude: string = this.Host + 'GetlatitudeANDlongitude';
   AssignCustomers: string = this.Host + 'AssignCustomers';
   SaveOwnTemplates: string = this.Host + 'SaveOwnTemplates';
   GetOwnTemplates: string = this.Host + 'GetOwnTemplates';
   GetOwnTemplatesHTMLContent: string = this.Host + 'GetOwnTemplatesHTMLContent';
   GetTokenContentMatchDownload: string = this.Host + 'GetTokenContentMatchDownload';
}

// localStorage.setItem('UserId', obj.UserId);
// localStorage.setItem('dfClientId', obj.dfClientId);
