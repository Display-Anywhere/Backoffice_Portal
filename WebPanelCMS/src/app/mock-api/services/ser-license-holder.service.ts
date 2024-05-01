import { Injectable, PipeTransform } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigAPI } from 'app/class/ConfigAPI';
@Injectable({
  providedIn: 'root'
})
export class SerLicenseHolderService {

  constructor(private http: HttpClient, private cApi: ConfigAPI) { }
  GetTemplates(dfClientId:string , GenreId, cDate, search){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ dfClientId , GenreId, cDate, search});
    return this.http.post(this.cApi.GetTemplates,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  DownloadTemplates_new(dfClientId,GenreId,FolderId,tList){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ dfClientId:dfClientId,GenreId:GenreId,FolderId:FolderId,
      tList:tList,dbType: localStorage.getItem('DBType') });
    return this.http.post(this.cApi.DownloadTemplates_new,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  DownloadTemplates(dfClientId,GenreId,FolderId,tList){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ dfClientId:dfClientId,GenreId:GenreId,FolderId:FolderId,
      tList:tList,dbType: localStorage.getItem('DBType') });
    return this.http.post(this.cApi.DownloadTemplates,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  DownloadTemplatesConvertTOMp4(dfClientId,GenreId,FolderId,tList){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ dfClientId:dfClientId,GenreId:GenreId,FolderId:FolderId,
      tList:tList,dbType: localStorage.getItem('DBType') });
    return this.http.post(this.cApi.DownloadTemplatesConvertTOMp4,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  GetOwnTemplates(dfClientId:string , GenreId, cDate, search){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ dfClientId , GenreId, cDate, search});
    return this.http.post(this.cApi.GetOwnTemplates,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  GetOwnTemplatesHTMLContent(_id:string){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ _id});
    return this.http.post(this.cApi.GetOwnTemplatesHTMLContent,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  DeleteTemplate(id:string){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({id});
    return this.http.post(this.cApi.DeleteTemplate,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillCombo(qry) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ Query: qry });
    return this.http.post(this.cApi.FillQueryCombo, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  FillTokenInfo(cid: string, IsActiveTokens) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ clientId: cid, UserId: localStorage.getItem('UserId'), IsActiveTokens: IsActiveTokens });
    return this.http.post(this.cApi.FillTokenInfo, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  CustomerLoginDetail(cid: string) {

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ clientId: cid });
    return this.http.post(this.cApi.CustomerLoginDetail, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  SaveUpdateUser(json:JSON){
    var cDate= new Date();
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = json;
    return this.http.post(this.cApi.SaveUpdateUser,params,{headers:headers})
     .pipe((data=>{return data;}))
  } 
  FillPlayerUsers(id){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ clientId: id, UserId: localStorage.getItem('UserId'), IsActiveTokens:"0"});
    return this.http.post(this.cApi.FillTokenInfo,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillUserList(id){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ clientId: id });
    return this.http.post(this.cApi.FillUserList,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  EditUser(uid){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ UserId: uid });
    return this.http.post(this.cApi.EditUser,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  DeleteUser(uid){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ UserId: uid });
    return this.http.post(this.cApi.DeleteUser,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  CommanSearch(type, text, mediaType, ClientId) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ searchType: type, searchText: text, mediaType: mediaType, IsRf: localStorage.getItem('IsRf'), ClientId: ClientId,IsAnnouncement:localStorage.getItem('IsAnnouncement') });
    return this.http.post(this.cApi.CommanSearch, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  UpdateAppLogo(ClientId, LogoId) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ ClientId: ClientId, LogoId: LogoId });
    return this.http.post(this.cApi.UpdateAppLogo, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  SetOnlineIndicator(ClientId, chkIndicator) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ ClientId: ClientId, chkIndicator: chkIndicator });
    return this.http.post(this.cApi.SetOnlineIndicator, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  ForceUpdate(tokenid) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ tokenid: tokenid });
    return this.http.post(this.cApi.ForceUpdate, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  ForceUpdateWithRestart(tokenid) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ tokenid: tokenid , playerrestart:"1"});
    return this.http.post(this.cApi.ForceUpdate, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  DeleteLogo(logoId) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ logoId: logoId });
    return this.http.post(this.cApi.DeleteLogo, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  BoxRestart(tokenid) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ tokenid: tokenid });
    return this.http.post(this.cApi.BoxRestart, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  SaveGenre(id, gname, mediatype) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ id: id, genrename: gname, mediatype: mediatype });
    return this.http.post(this.cApi.SaveGenre, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  SaveFolder(id, fname, dfClientId,IsPromoFolder,IsAutoDelete,dtpDeleteDate) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ id: id, fname: fname, dfClientId: dfClientId,IsPromoFolder:IsPromoFolder,IsAutoDelete:IsAutoDelete,dtpDeleteDate:dtpDeleteDate });
    return this.http.post(this.cApi.SaveFolder, params, { headers: headers })
      .pipe((data => { return data; }))
  }

  FillSignageLogo(CustomerId, FolderId) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ CustomerId: CustomerId, FolderId: FolderId });
    return this.http.post(this.cApi.FillSignageLogo, params, { headers: headers })
      .pipe((data => { return data; }))
  }

  SaveModifyLogs(tokenid: string, ModifyData: string) {
    var UserId = localStorage.getItem('UserId');
    var dfclientid = localStorage.getItem('dfClientId');
    var IPAddress = localStorage.getItem('ipAddress');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ dfclientid: dfclientid, IPAddress: IPAddress, ModifyData: ModifyData, UserId: UserId, EffectToken: tokenid });
    return this.http.post(this.cApi.SaveModifyLogs, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  upload(formData) {
    return this.http.post<any>(`${this.cApi.UploadSheet}`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event, formData)),
      catchError(this.handleError)
    );
  }
  uploadLogo(formData) {
    return this.http.post<any>(`${this.cApi.UploadImage}`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event, formData)),
      catchError(this.handleError)
    );
  }
  uploadevent(formData) {
    return this.http.post<any>(`${this.cApi.UploadEvent}`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event, formData)),
      catchError(this.handleError)
    );
  }
  private getEventMessage(event: HttpEvent<any>, formData) {

    switch (event.type) {

      case HttpEventType.UploadProgress:
        return this.fileUploadProgress(event);

      case HttpEventType.Response:
        return this.apiResponse(event);

      default:
        return `File "${formData.get('profile').name}" surprising upload event: ${event.type}.`;
    }
  }
  private fileUploadProgress(event) {
    const percentDone = Math.round(100 * event.loaded / event.total);
    return { status: 'progress', message: percentDone };
  }
  private apiResponse(event) {
    return event.body;
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened. Please try again later.');
  }

  DeleteFolder(id) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({ id });
    return this.http.post(this.cApi.DeleteFolder, params, { headers })
      .pipe((data => data));
  }
  UpdateTokenGroups(tokenIds, GroupId,IsCheckGroupSchedule) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({ tokenIds, GroupId ,IsCheckGroupSchedule});
    return this.http.post(this.cApi.UpdateTokenGroups, params, { headers })
      .pipe((data => data));
  }

DeleteGroup(id) {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const params = JSON.stringify({ id });
  return this.http.post(this.cApi.DeleteGroup, params, { headers })
    .pipe((data => data));
}
SaveRebootTime(json) {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post(this.cApi.SaveRebootTime, json, { headers })
    .pipe((data => data));
}
SaveOpeningHours(json) {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post(this.cApi.SaveOpeningHours, json, { headers })
    .pipe((data => data));
}
FillTokenOpeningHours(cid: string, IsActiveTokens) {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const params = JSON.stringify({ clientId: cid, UserId: localStorage.getItem('UserId'), IsActiveTokens });
  return this.http.post(this.cApi.FillTokenOpeningHours, params, { headers })
    .pipe((data => data));
}


UpdateTokenInfo(formData) {
  return this.http.post<any>(`${this.cApi.UpdateTokenInfo}`, formData, {
    reportProgress: true,
    observe: 'events'
  }).pipe(
    map(event => this.getEventMessage(event, formData)),
    catchError(this.handleError)
  );
}
FillCustomerWithKey(qry) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = JSON.stringify({ Query: qry });
  return this.http.post(this.cApi.FillCustomerWithKey, params, { headers: headers })
    .pipe((data => { return data; }))
}
GetClientFolder(cid: string) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = JSON.stringify({ ClientId: cid });
  return this.http.post(this.cApi.GetClientFolder, params, { headers: headers })
    .pipe((data => { return data; }))
}
ReplaceFolderContent(cid,folderId) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = JSON.stringify({ ClientId: cid , FolderId: folderId });
  return this.http.post(this.cApi.ReplaceFolderContent, params, { headers: headers })
    .pipe((data => { return data; }))
}
SaveTemplateUrl(json) {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post(this.cApi.SaveTemplateUrl, json, { headers })
    .pipe((data => data));
}
GetTemplateUrl(cid) {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = JSON.stringify({ id: cid});
  return this.http.post(this.cApi.GetTemplateUrl, params, { headers })
    .pipe((data => data));
}
DeleteTemplateUrl(id) {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = JSON.stringify({ id: id});
  return this.http.post(this.cApi.DeleteTemplateUrl, params, { headers })
    .pipe((data => data));
}
matches(country, term: string, pipe: PipeTransform) {
  return country.MediaType.toLowerCase().includes(term.toLowerCase())
    || country.city.toLowerCase().includes(term.toLowerCase())
    || country.Name.toLowerCase().includes(term.toLowerCase())
    || country.location.toLowerCase().includes(term.toLowerCase())
    || country.gName.toLowerCase().includes(term.toLowerCase())
    || pipe.transform(country.tokenid).includes(term);
}
GetFolderContent(fid,cid) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = JSON.stringify({ FolderId: fid, ClientId:cid,DBType: localStorage.getItem('DBType')});
  return this.http.post(this.cApi.GetFolderContent, params, { headers: headers })
    .pipe((data => { return data; }))
}
SavePublishSchedule(ClientId, hour) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = JSON.stringify({ clientid: ClientId, publishHr: hour });
  return this.http.post(this.cApi.SavePublishSchedule, params, { headers: headers })
    .pipe((data => { return data; }))
}
SavePublishToken(publishid,tokenid) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = JSON.stringify({ publishid:publishid,tokenid: tokenid });
  return this.http.post(this.cApi.SavePublishToken, params, { headers: headers })
    .pipe((data => { return data; }))
}
GetTokenContentMatchDownload(cid) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = JSON.stringify({ ClientId: cid });
  return this.http.post(this.cApi.GetTokenContentMatchDownload, params, { headers: headers })
    .pipe((data => { return data; }))
}
GetMeetingRooms(cid) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = JSON.stringify({ ClientId: cid });
  return this.http.post(this.cApi.GetMeetingRooms, params, { headers: headers })
    .pipe((data => { return data; }))
}
UpdateMeetingRoomsInfo(json) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = json;
  return this.http.post(this.cApi.UpdateMeetingRoomsInfo, params, { headers: headers })
    .pipe((data => { return data; }))
}
GetEventDetails(eventDate,dfclientid) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = JSON.stringify({ eventDate, dfclientid });
  return this.http.post(this.cApi.GetEventDetails, params, { headers: headers })
    .pipe((data => { return data; }))
}
GetFutureDateEventDetails(eventDate,dfclientid) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = JSON.stringify({ eventDate, dfclientid });
  return this.http.post(this.cApi.GetFutureDateEventDetails, params, { headers: headers })
    .pipe((data => { return data; }))
}
SaveRoomCustomerEvent(json) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = json;
  return this.http.post(this.cApi.SaveRoomCustomerEvent, params, { headers: headers })
    .pipe((data => { return data; }))
}
SaveCustomerEventLogo(json) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = json;
  return this.http.post(this.cApi.SaveCustomerEventLogo, params, { headers: headers })
    .pipe((data => { return data; }))
}
AppendSignagePlaylistRoom(cd, dfclientid) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = JSON.stringify({ cd, dfclientid });
  return this.http.post(this.cApi.AppendSignagePlaylistRoom, params, { headers: headers })
    .pipe((data => { return data; }))
}
GetRoomSignagePlaylist(cid) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = JSON.stringify({ ClientId: cid });
  return this.http.post(this.cApi.GetRoomSignagePlaylist, params, { headers: headers })
    .pipe((data => { return data; }))
}
GetPromoLogo(cid) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = JSON.stringify({ ClientId: cid });
  return this.http.post(this.cApi.GetPromoLogo, params, { headers: headers })
    .pipe((data => { return data; }))
}
SetUnsetPromoLogo(cid, titleid, IsSet,startDate,endDate) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = JSON.stringify({ dfclientid: cid , titleid: titleid, IsSet:IsSet,startDate:startDate,endDate:endDate});
  return this.http.post(this.cApi.SetUnsetPromoLogo, params, { headers: headers })
    .pipe((data => { return data; }))
}
UpdatePlayerExpire(tokenid,expiryDate) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = JSON.stringify({ tokenid: tokenid,expiryDate:expiryDate });
  return this.http.post(this.cApi.UpdatePlayerExpire, params, { headers: headers })
    .pipe((data => { return data; }))
}
UpdateTwoWayAuth(TwoWayAuthStatus,UserId) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = JSON.stringify({ ClientId: localStorage.getItem('dfClientId'), TwoWayAuthStatus: TwoWayAuthStatus,UserId:UserId });
  return this.http.post(this.cApi.UpdateTwoWayAuth, params, { headers: headers })
    .pipe((data => { return data; }))
}
kpnLogin() {
  return this.http.get(this.cApi.KPNLogin)
    .pipe((data => { return data; }))
}
GetKpnChannels() {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = JSON.stringify({ code: localStorage.getItem('code')});
  return this.http.post(this.cApi.GetKpnChannels, params, { headers: headers })
    .pipe((data => { return data; }))
}
GetKpnChannelDetails(channelid) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = JSON.stringify({ code: localStorage.getItem('code'), chid:channelid});
  return this.http.post(this.cApi.GetKpnChannelDetail, params, { headers: headers })
    .pipe((data => { return data; }))
}
GetJoanDeviceStatus() {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.get(this.cApi.GetJoanDeviceStatus, { headers: headers })
    .pipe((data => { return data; }))
}
UpdateRoomsPaxOccupancy(json) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = json;
  return this.http.post(this.cApi.UpdateRoomsPaxOccupancy, params, { headers: headers })
    .pipe((data => { return data; }))
}
SaveRoomEvent(json) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = json;
  return this.http.post(this.cApi.SaveRoomEvent, params, { headers: headers })
    .pipe((data => { return data; }))
}
DeleteRoomEvent(id) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = JSON.stringify({ pschid: id});
  return this.http.post(this.cApi.DeleteRoomEvent, params, { headers: headers })
    .pipe((data => { return data; }))
}
GetDefaultRoomsPaxOccupancy(clientid) {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var params = JSON.stringify({ clientid: clientid, _id:"0" });
  return this.http.post(this.cApi.GetDefaultRoomsPaxOccupancy, params, { headers: headers })
    .pipe((data => { return data; }))
}
DeleteRoomGroup(id) {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const params = JSON.stringify({ id });
  return this.http.post(this.cApi.DeleteRoomGroup, params, { headers })
    .pipe((data => data));
}
UpdateVenueGroups(tokenIds, GroupId,IsCheckGroupSchedule) {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const params = JSON.stringify({ tokenIds, GroupId ,IsCheckGroupSchedule});
  return this.http.post(this.cApi.UpdateVenueGroups, params, { headers })
    .pipe((data => data));
}
UnAssignVenueGroups(id) {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const params = JSON.stringify({ id });
  return this.http.post(this.cApi.UnAssignVenueGroups, params, { headers })
    .pipe((data => data));
}
}
