import { Injectable } from '@angular/core';
import {ConfigAPI} from '../../class/ConfigAPI';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TokenInfoServiceService {

  constructor(private http:HttpClient,private cApi:ConfigAPI) { }
  FillCombo(query:string){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ Query: query });
    return this.http.post(this.cApi.FillQueryCombo,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillTokenContent(tokenid:string){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ tokenId: tokenid });
    return this.http.post(this.cApi.FillTokenContent,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  ResetToken(tokenid:string,tokenCode:string){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({tokenId:tokenid,tokenCode: tokenCode});
      return this.http.post(this.cApi.ResetToken,params,{headers:headers})
       .pipe((data=>{return data;}))
  }
  SaveTokenInfo(json:JSON){
     let headers = new HttpHeaders({ 'Content-Type':'application/json' });
   var params = json
     return this.http.post(this.cApi.SaveTokenInformation,params,{headers:headers})
      .pipe((data=>{return data;}))
  }
  UpdateTokenSch(pschid:string,stime:string,eTime:string,PercentageValue){
    
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
  var params = JSON.stringify({pschid:pschid,ModifyStartTime:stime,ModifyEndTime:eTime,PercentageValue:PercentageValue});
    return this.http.post(this.cApi.UpdateTokenSchedule,params,{headers:headers})
     .pipe((data=>{return data;}))
 }
 DeleteTokenSch(pschid){
  let headers = new HttpHeaders({ 'Content-Type':'application/json' });
  var params = JSON.stringify({pschid:pschid});
  return this.http.post(this.cApi.DeleteTokenSch,params,{headers:headers})
   .pipe((data=>{return data;}))
}


SaveModifyLogs(tokenid:string, ModifyData:string){
var UserId= localStorage.getItem('UserId');
var dfclientid =localStorage.getItem('dfClientId');
var IPAddress =localStorage.getItem('ipAddress');
  let headers = new HttpHeaders({ 'Content-Type':'application/json' });
  var params = JSON.stringify({ dfclientid: dfclientid,IPAddress:IPAddress,ModifyData:ModifyData,UserId:UserId,EffectToken:tokenid });
  return this.http.post(this.cApi.SaveModifyLogs,params,{headers:headers})
   .pipe((data=>{return data;}))
}
CitySateNewModify(id,name,type,stateid, CountryId, dfClientId){
  let headers = new HttpHeaders({ 'Content-Type':'application/json' });
  var params = JSON.stringify({id:id,name:name,type:type,stateid:stateid,CountryId:CountryId,dfClientId:dfClientId});
  return this.http.post(this.cApi.CitySateNewModify,params,{headers:headers})
   .pipe((data=>{return data;}))
}
FindToken(tokenid, IsAdmin,ClientId,DbType){
  let headers = new HttpHeaders({ 'Content-Type':'application/json' });
  var params = JSON.stringify({ tokenid: tokenid,IsAdmin:IsAdmin,ClientId:ClientId,DbType:DbType });
  return this.http.post(this.cApi.FindToken,params,{headers:headers})
   .pipe((data=>{return data;}))
}
DeleteTokenSch_future(pschid){
  let headers = new HttpHeaders({ 'Content-Type':'application/json' });
  var params = JSON.stringify({pschid:pschid});
  return this.http.post(this.cApi.DeleteTokenSch_future,params,{headers:headers})
   .pipe((data=>{return data;}))
}
GetSplPlaylistDateWiseLive(tokenid,DfClientId,WeekNo){
  let headers = new HttpHeaders({ 'Content-Type':'application/json' });
  var params = JSON.stringify({ WeekNo:WeekNo,TokenId: tokenid,DfClientId:DfClientId,CurrentDateTime:"NA" });
  return this.http.post(this.cApi.GetSplPlaylistDateWiseLive,params,{headers:headers})
   .pipe((data=>{return data;}))
}
GetPlaylistsTitlesDownloadStatus(tokenid,splplaylistid){
  let headers = new HttpHeaders({ 'Content-Type':'application/json' });
  var params = JSON.stringify({ tokenid: tokenid,splplaylistid:splplaylistid });
  return this.http.post(this.cApi.GetPlaylistsTitlesDownloadStatus,params,{headers:headers})
   .pipe((data=>{return data;}))
}
GetAdsDownloadStatus(tokenid){
  let headers = new HttpHeaders({ 'Content-Type':'application/json' });
  var params = JSON.stringify({ tokenid: tokenid,splplaylistid:"0" });
  return this.http.post(this.cApi.GetAdsDownloadStatus,params,{headers:headers})
   .pipe((data=>{return data;}))
}
FillSearchAds(customerId,cDate,tokenid){
  let headers = new HttpHeaders({ 'Content-Type':'application/json' });
  var params = JSON.stringify({ customerId: customerId ,cDate:cDate, TokenId:tokenid});
  return this.http.post(this.cApi.FillSearchAds,params,{headers:headers})
   .pipe((data=>{return data;}))
}
FindStringInTable(filterText, IsAdmin,ClientId,DbType){
  let headers = new HttpHeaders({ 'Content-Type':'application/json' });
  var params = JSON.stringify({ filterText: filterText,IsAdmin:IsAdmin,ClientId:ClientId,DbType:DbType });
  return this.http.post(this.cApi.FindStringInTable,params,{headers:headers})
   .pipe((data=>{return data;}))
}
SaveRoomGroup(id,name, dfClientId){
  let headers = new HttpHeaders({ 'Content-Type':'application/json' });
  var params = JSON.stringify({id:id,name:name,dfClientId:dfClientId});
  return this.http.post(this.cApi.SaveRoomGroup,params,{headers:headers})
   .pipe((data=>{return data;}))
}  
DeleteDefaultPlaylist(id){
  let headers = new HttpHeaders({ 'Content-Type':'application/json' });
  var params = JSON.stringify({pschid:id});
  return this.http.post(this.cApi.DeleteDefaultPlaylist,params,{headers:headers})
   .pipe((data=>{return data;}))
}
}
