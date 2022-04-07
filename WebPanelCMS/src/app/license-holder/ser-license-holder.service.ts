import { Injectable, PipeTransform } from '@angular/core';
import { ConfigAPI } from '../class/ConfigAPI';
import { HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SerLicenseHolderService {

  constructor(private http: HttpClient, private cApi: ConfigAPI) { }
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
  DeleteLogo(logoId) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ logoId: logoId });
    return this.http.post(this.cApi.DeleteLogo, params, { headers: headers })
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
}
