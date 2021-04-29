import { Injectable } from '@angular/core';
import {ConfigAPI} from '../class/ConfigAPI';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
@Injectable({
  providedIn: 'root'
})
export class IPlayService {
 
  constructor(private http:HttpClient,private cApi:ConfigAPI, public auth:AuthService) { }
  FillPlayer(id){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ clientId: id, UserId: localStorage.getItem('UserId'), IsActiveTokens:"1"});
    return this.http.post(this.cApi.FillTokenInfo,params,{headers:headers})
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
  FillActivePlaylist(TokenId,cid){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ Id: TokenId,ClientId: cid });
    return this.http.post(this.cApi.Playlist,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  PlaylistSong(id:string,IsBestOffPlaylist:string){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ playlistid: id,IsBestOffPlaylist:IsBestOffPlaylist });
    return this.http.post(this.cApi.PlaylistSong,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillAds(tid){
    var cDate= new Date();
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ customerId: localStorage.getItem('dfClientId') ,cDate:cDate,TokenId:tid});
    return this.http.post(this.cApi.FillSearchAds,params,{headers:headers})
     .pipe((data=>{return data;}))
  } 
  FillCombo(query:string){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ Query: query });
    return this.http.post(this.cApi.FillQueryCombo,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillSongList(mediaType,IsExplicit){
    var params = JSON.stringify({ searchType: "",searchText:"",mediaType:mediaType , 
    IsRf:localStorage.getItem('IsRf'), ClientId:localStorage.getItem('dfClientId'),
    IsExplicit:IsExplicit,IsAdmin:this.auth.IsAdminLogin$.value 
    ,DBType:localStorage.getItem('DBType'), PageNo:"1" });
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    return this.http.post(this.cApi.SongList,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  CommanSearch(type,text,mediaType){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ searchType: type,searchText:text,mediaType:mediaType, 
      IsRf:localStorage.getItem('IsRf'), ClientId:localStorage.getItem('dfClientId'),
      IsExplicit:false,IsAdmin:this.auth.IsAdminLogin$.value,
      DBType:localStorage.getItem('DBType') , PageNo:"1",IsAnnouncement:localStorage.getItem('IsAnnouncement') });
    return this.http.post(this.cApi.CommanSearch,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  SendNoti(json){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = json;
    return this.http.post(this.cApi.SendNoti,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  GetFCMID(tid){
    var cDate= new Date();
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({Tokenid:tid});
    return this.http.post(this.cApi.GetFCMID,params,{headers:headers})
     .pipe((data=>{return data;}))
  } 
  SaveUpdateUser(json:JSON){
    var cDate= new Date();
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = json;
    return this.http.post(this.cApi.SaveUpdateUser,params,{headers:headers})
     .pipe((data=>{return data;}))
  } 



  SaveUpdateOfflineAlert(id,email,interval,lstToken,dfClientid, weekDay){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ id: id,email:email,interval:interval,Responce:'0',lstToken:lstToken,dfClientid:dfClientid,weekDay:weekDay });
    return this.http.post(this.cApi.SaveUpdateOfflineAlert,params,{headers:headers})
     .pipe((data=>{return data;}))
  } 

  FillOfflineAlertList(id){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ clientId: id });
    return this.http.post(this.cApi.FillOfflineAlertList,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  EditOfflineUser(uid){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ UserId: uid });
    return this.http.post(this.cApi.EditOfflineUser,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  DeleteOfflineAlert(uid){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ UserId: uid });
    return this.http.post(this.cApi.DeleteOfflineAlert,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
} 