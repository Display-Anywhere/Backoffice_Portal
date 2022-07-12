import { Injectable } from '@angular/core';
import {ConfigAPI} from '../../class/ConfigAPI';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthServiceOwn } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SerAdminLogService {

  constructor(private http:HttpClient,private cApi:ConfigAPI, public auth:AuthServiceOwn) { }
  FillCombo(query:string){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ Query: query });
    return this.http.post(this.cApi.FillQueryCombo,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillAdminLogs(cid:string){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ clientId: cid});
    return this.http.post(this.cApi.FillAdminLogs,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  GetGenreList(mediatype:string,mediaStyle:string,FilterType,FilterValue){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ mediatype: mediatype,mediaStyle:mediaStyle,
       ClientId:localStorage.getItem('dfClientId'), 
       DBType:localStorage.getItem('DBType'), IsAdmin:this.auth.IsAdminLogin$.value,
       ContentType:this.auth.ContentType$, FilterType:FilterType,FilterValue:FilterValue});
    return this.http.post(this.cApi.GetGenreList,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  NewSavePlaylist(json){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify(json);
    return this.http.post(this.cApi.NewSavePlaylist,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillPlayerIpLogs(cid:string,TokenId){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ clientId: cid,TokenId:TokenId});
    return this.http.post(this.cApi.GetTokenIpAddressLogs,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillTokenInfo(cid:string,IsActiveOnly){
      
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ clientId: cid ,UserId: localStorage.getItem('UserId'),IsActiveTokens:IsActiveOnly});
    return this.http.post(this.cApi.FillTokenInfo,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  AssignCustomers(cid:string,AssignClientId){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ ClientId: cid,AssignClientId:AssignClientId});
    return this.http.post(this.cApi.AssignCustomers,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  GetlatitudeANDlongitude(ipaddress:string){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ IpAddress: ipaddress});
    return this.http.post(this.cApi.GetlatitudeANDlongitude,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
}
