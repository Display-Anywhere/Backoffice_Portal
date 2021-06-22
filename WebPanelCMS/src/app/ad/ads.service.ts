import { Injectable } from '@angular/core';
import {ConfigAPI} from '../class/ConfigAPI';
import { HttpClient, HttpHeaders ,HttpEvent, HttpErrorResponse, HttpEventType} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdsService {

  constructor(private http:HttpClient,private cApi:ConfigAPI) { }
  FillClientCombo(){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var q = "select DFClientID as id,ClientName as displayname from ( ";
      q = q + " select distinct DFClients.DFClientID,DFClients.ClientName from DFClients ";
      q = q + " inner join AMPlayerTokens on DFClients.DfClientid=AMPlayerTokens.Clientid ";
      q = q + " where DFClients.CountryCode is not null and DFClients.DealerDFClientID= " + localStorage.getItem('dfClientId') + "    ";
      q = q + " union all select distinct DFClients.DFClientID,DFClients.ClientName from DFClients ";
      q = q + " inner join AMPlayerTokens on DFClients.DfClientid=AMPlayerTokens.Clientid ";
      q = q + " where DFClients.CountryCode is not null and DFClients.MainDealerid= " + localStorage.getItem('dfClientId') + "    ";
      q = q + "   ) as a order by ClientName desc ";
    var params = JSON.stringify({ Query: q });
    return this.http.post(this.cApi.FillQueryCombo,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillSearchAds(customerId,cDate){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ customerId: customerId ,cDate:cDate});
    return this.http.post(this.cApi.FillSearchAds,params,{headers:headers})
     .pipe((data=>{return data;}))
  }  
  FillTokenInfo(cid){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ clientId: cid, UserId: localStorage.getItem('UserId')});
     
    return this.http.post(this.cApi.FillTokenInfoAds,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillCombo(qry){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ Query: qry });
    return this.http.post(this.cApi.FillQueryCombo,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillSaveAds(aid,cId){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ advtid: aid,ClientId:cId});
    return this.http.post(this.cApi.FillSaveAds,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  UpdateAds(json:JSON){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = json;
    return this.http.post(this.cApi.UpdateAds,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  DeleteAds(aid){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ advtid: aid});
    return this.http.post(this.cApi.DeleteAds,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  DeletePlaylistAds(aid){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ advtid: aid});
    return this.http.post(this.cApi.DeletePlaylistAds,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillSavePlaylistAds(id){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ advtid: id});
    return this.http.post(this.cApi.FillSavePlaylistAds,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  upload(formData) {
    return this.http.post<any>(`${this.cApi.SaveAdsAndUploadFile}`, formData, {
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
}
 