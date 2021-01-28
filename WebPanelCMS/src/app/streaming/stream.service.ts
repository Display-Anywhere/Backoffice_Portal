import { Injectable } from '@angular/core';
import { ConfigAPI } from '../class/ConfigAPI';
import { HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StreamService {

  constructor(private http: HttpClient, private cApi: ConfigAPI) { }
  FillCombo(qry) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ Query: qry });
    return this.http.post(this.cApi.FillQueryCombo, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  FillStreamList(OwnerCustomerId,TokenId) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ OwnerCustomerId: OwnerCustomerId,TokenId:TokenId });
    
    return this.http.post(this.cApi.GetOnlineStream, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  UpdateStream(OwnerCustomerId,sId,sName,sLink,sImgLink) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ sId:sId,sName:sName,sLink:sLink,
      OwnerId: OwnerCustomerId,sImgLink:sImgLink });
    return this.http.post(this.cApi.UpdateStream, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  DeleteStream(sId) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ sId: sId });
    return this.http.post(this.cApi.DeleteStream, params, { headers: headers })
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
  FillTokenInfo(cid:string){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ clientId: cid,UserId: localStorage.getItem('UserId') });
    return this.http.post(this.cApi.FillTokenInfo,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  AssignStream(OwnerCustomerId,TokenSelected,StreamSelected) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ TokenSelected:TokenSelected,StreamSelected:StreamSelected,
      OwnerId: OwnerCustomerId});
    return this.http.post(this.cApi.AssignStream, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  DeleteAssignStream(TokenId,StreamId) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ TokenId:TokenId,StreamId:StreamId});
    return this.http.post(this.cApi.DeleteAssignStream, params, { headers: headers })
      .pipe((data => { return data; }))
  }

  FillMiddleImage(TokenId, OwnerCustomerId){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ TokenId: TokenId ,OwnerCustomerId:OwnerCustomerId });
    return this.http.post(this.cApi.FillMiddleImage,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  SetMiddleImg(TokenId,TitleId){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ TokenId: TokenId ,TitleId:TitleId });
    return this.http.post(this.cApi.SetMiddleImg,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  DeleteMiddleImg(TokenId,TitleId){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ TokenId: TokenId ,TitleId:TitleId });
    return this.http.post(this.cApi.DeleteMiddleImg,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
}
