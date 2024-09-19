import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigAPI } from 'app/class/ConfigAPI';

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
  SaveFutureSchedule(json:JSON){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = json
    return this.http.post(this.cApi.SaveFutureSchedule,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillSF_future(cmbSearchCustomer,cmbSearchFormat,cmbSearchPlaylist){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params= JSON.stringify({clientId:cmbSearchCustomer,formatId:cmbSearchFormat,playlistId:cmbSearchPlaylist,UserId: localStorage.getItem('UserId')})
 
    return this.http.post(this.cApi.FillSF_future,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  DeleteTokenSch_future(pschid){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({pschid:pschid});
    return this.http.post(this.cApi.DeleteTokenSch_future,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  GetClientSignageContent(clientId){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params= JSON.stringify({dfclientId:clientId,cd:""})
    return this.http.post(this.cApi.GetClientSignageContent,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  GetSignageContentPlayers(id){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params= JSON.stringify({_id:id})
    return this.http.post(this.cApi.GetSignageContentPlayers,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  SaveMasterSchedule(json:JSON){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = json
    return this.http.post(this.cApi.SaveMasterSchedule,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  CheckMasterSchedule(json){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = json
    return this.http.post(this.cApi.CheckMasterSchedule,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  GetMasterScheduleDetail(masterscheduleid,dfclientid,UserId){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ masterscheduleid: masterscheduleid,dfclientid:dfclientid,UserId:UserId });
    return this.http.post(this.cApi.GetMasterScheduleDetail,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  DeleteMasterSchedule(masterscheduleid,dfclientid,DeleteOption,id){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({masterscheduleid:masterscheduleid,dfclientid:dfclientid,DeleteOption:DeleteOption,Id:id});
    return this.http.post(this.cApi.DeleteMasterSchedule,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  GetDashboardCustomerTotals(dfclientid){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ClientId:dfclientid});
    return this.http.post(this.cApi.GetDashboardCustomerTotals,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  GetDashboardCities(dfclientid){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ClientId:dfclientid});
    return this.http.post(this.cApi.GetDashboardCities,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  GetDashboardCityDevices(dfclientid,CityId){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ClientId:dfclientid,id:CityId});
    return this.http.post(this.cApi.GetDashboardCityDevices,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  GetDashboardCustomerDevicesStatus(dfclientid,searchType){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ClientId:dfclientid,searchType:searchType});
    return this.http.post(this.cApi.GetDashboardCustomerDevicesStatus,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  SaveCopyPlaylist(json){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = json
    return this.http.post(this.cApi.SaveCopyPlaylist,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
}
