import { Injectable } from '@angular/core';
import {ConfigAPI} from '../class/ConfigAPI';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StoreForwardService {

  constructor(private http:HttpClient,private cApi:ConfigAPI) { }
  FillCombo(query:string){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ Query: query });
    return this.http.post(this.cApi.FillQueryCombo,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  Playlist(id:string){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ Id: id });
    return this.http.post(this.cApi.Playlist,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillTokenInfo(cid:string){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ clientId: cid,UserId: localStorage.getItem('UserId') });
    return this.http.post(this.cApi.FillTokenInfo,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  SaveSF(json:JSON){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = json
    return this.http.post(this.cApi.SaveSF,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillSF(cmbSearchCustomer,cmbSearchFormat,cmbSearchPlaylist){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params= JSON.stringify({clientId:cmbSearchCustomer,formatId:cmbSearchFormat,playlistId:cmbSearchPlaylist,UserId: localStorage.getItem('UserId')})
 
    return this.http.post(this.cApi.FillSF,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  UpdateTokenSch(pschid:string,stime:string,eTime:string){
    
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
  var params = JSON.stringify({pschid:pschid,ModifyStartTime:stime,ModifyEndTime:eTime});
    return this.http.post(this.cApi.UpdateTokenSchedule,params,{headers:headers})
     .pipe((data=>{return data;}))
 }


 DeleteTokenSch(pschid){
  let headers = new HttpHeaders({ 'Content-Type':'application/json' });
  var params = JSON.stringify({pschid:pschid});
  return this.http.post(this.cApi.DeleteTokenSch,params,{headers:headers})
   .pipe((data=>{return data;}))
}

SaveModifyLogs(tokenid, ModifyData:string){
  var UserId= localStorage.getItem('UserId');
  var dfclientid =localStorage.getItem('dfClientId');
  var IPAddress =localStorage.getItem('ipAddress');
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ dfclientid: dfclientid,IPAddress:IPAddress,ModifyData:ModifyData,UserId:UserId,EffectToken:tokenid });

    return this.http.post(this.cApi.SaveModifyLogs,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  SaveAdPlaylist(json:JSON){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = json
    return this.http.post(this.cApi.SaveAdPlaylist,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillAdPlaylist(cmbSearchCustomer,cmbSearchToken){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params= JSON.stringify({clientId:cmbSearchCustomer,tokenid:cmbSearchToken})
 
    return this.http.post(this.cApi.FillAdPlaylist,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  GetFolderContent(fid,cid){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ FolderId:fid,ClientId: cid,DBType: localStorage.getItem('DBType') });
    return this.http.post(this.cApi.GetFolderContent,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  SaveTransferContent(json:JSON){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = json
    return this.http.post(this.cApi.SaveTransferContent,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  SaveCopyContent(json:JSON){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = json
    return this.http.post(this.cApi.SaveCopyContent,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
}
