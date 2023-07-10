import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigAPI } from 'src/app/class/ConfigAPI';
import { AuthServiceOwn } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  constructor(private http:HttpClient,private cApi:ConfigAPI, public auth:AuthServiceOwn) { }
  FillCombo(query:string){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ Query: query });
    return this.http.post(this.cApi.FillQueryCombo,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillTokenInfo(cid: string) {

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ clientId: cid, UserId: localStorage.getItem('UserId') });
    return this.http.post(this.cApi.FillTokenInfo, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  CommanSearch(type,text,mediaType,IsExplicit,PageNo,ClientId){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ searchType: type,searchText:text,mediaType:mediaType, 
      IsRf:localStorage.getItem('IsRf'), ClientId:ClientId,
      IsExplicit:IsExplicit,IsAdmin:this.auth.IsAdminLogin$.value,DBType:localStorage.getItem('DBType'),
      ContentType:localStorage.getItem('ContentType'),PageNo:PageNo,
      LoginClientId:localStorage.getItem('dfClientId'), IsAnnouncement:localStorage.getItem('IsAnnouncement')});
    return this.http.post(this.cApi.CommanSearch,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  DeleteMachineTitle(Tokenid,Titleid){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ Tokenid: Tokenid,titleid:Titleid});
    return this.http.post(this.cApi.DeleteMachineTitle,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  GetMachineAnnouncement(Tokenid: string) {

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ Tokenid: Tokenid });
    return this.http.post(this.cApi.GetMachineAnnouncement, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  SaveMachineAnnouncement(TokenId,titleid, chkWithPrevious){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ TokenId: TokenId,titleid:titleid,chkWithPrevious:chkWithPrevious});
    
    return this.http.post(this.cApi.SaveMachineAnnouncement,params,{headers:headers})
     .pipe((data=>{return data;}))
  } 
  UpdateMachineAnnouncementSRNo(tokenId, json){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ tokenId: tokenId,lstTitleSR:json});
    console.log(params);
    return this.http.post(this.cApi.UpdateMachineAnnouncementSRNo,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  SaveKeyboardAnnouncement(TokenId,splPlaylistId){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ TokenId: TokenId,splPlaylistId:splPlaylistId});
    
    return this.http.post(this.cApi.SaveKeyboardAnnouncement,params,{headers:headers})
     .pipe((data=>{return data;}))
  } 
  GetKeyboardAnnouncement(Tokenid: string) {

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ Tokenid: Tokenid });
    return this.http.post(this.cApi.GetKeyboardAnnouncement, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  DeleteKeyboardAnnouncement(id){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ id: id});
    return this.http.post(this.cApi.DeleteKeyboardAnnouncement,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  DeleteInstantPlayPlaylist(id){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ id: id});
    return this.http.post(this.cApi.DeleteInstantPlayPlaylist,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  SetFireAlert(tokenId,titleid,MediaType){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ tokenId: tokenId,titleid:titleid,MediaType:MediaType});
    console.log(params);
    return this.http.post(this.cApi.SetFireAlert,params,{headers:headers})
     .pipe((data=>{return data;}))
  } 
  GetFireAlert(Tokenid: string) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ Tokenid: Tokenid });
    return this.http.post(this.cApi.GetFireAlert, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  DeleteFireAlert(Tokenid,Titleid){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ Tokenid: Tokenid,titleid:Titleid});
    return this.http.post(this.cApi.DeleteFireAlert,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  SaveInstantMobileAnnouncement(TokenId,splPlaylistId,FormatId,ClientId){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ TokenId: TokenId,splPlaylistId:splPlaylistId,FormatId:FormatId,ClientId:ClientId});
    
    return this.http.post(this.cApi.SaveInstantMobileAnnouncement,params,{headers:headers})
     .pipe((data=>{return data;}))
  } 
  GetInstantMobileAnnouncement(Tokenid: string) {

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ Tokenid: Tokenid });
    return this.http.post(this.cApi.GetInstantMobileAnnouncement, params, { headers: headers })
      .pipe((data => { return data; }))
  }

  AssignKpnChannels(TokenId,channel,Overight_Assign){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ TokenId: TokenId,channel:channel,Overight_Assign:Overight_Assign});
    
    return this.http.post(this.cApi.AssignKpnChannels,params,{headers:headers})
     .pipe((data=>{return data;}))
  } 
  GetPlayerKpnChannels(tokenid) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ tokenid: tokenid });
    return this.http.post(this.cApi.GetPlayerKpnChannels, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  RemovePlayerKpnChannel(_id) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ _id: _id });
    return this.http.post(this.cApi.RemovePlayerKpnChannel, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  GetKpnChannelSummary(channelid) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ channelid: channelid });
    return this.http.post(this.cApi.GetKpnChannelSummary, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  GetLibraryGenre(){
    return this.http.get(this.cApi.GetLibraryGenre)
     .pipe((data=>{return data;}))
  }
  GetLibrarySubGenre(id) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ _id: id });
    return this.http.post(this.cApi.GetLibrarySubGenre, params, { headers: headers })
      .pipe((data => { return data; }))
  }
}
