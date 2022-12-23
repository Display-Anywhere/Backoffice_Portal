import { Injectable } from '@angular/core';
import {ConfigAPI} from '../class/ConfigAPI';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SerReportService {

  constructor(private http:HttpClient,private cApi:ConfigAPI) { }
  FillCombo(qry){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ Query: qry });
    return this.http.post(this.cApi.FillQueryCombo,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillTokenInfo(cid:string,IsActiveOnly){
      
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ clientId: cid ,UserId: localStorage.getItem('UserId'),IsActiveTokens:IsActiveOnly});
    return this.http.post(this.cApi.FillTokenInfo,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillPlayedSongsLog(fromDate, Todate,tokenid){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ cDate: fromDate, tokenid:tokenid ,ToDate:Todate});
    return this.http.post(this.cApi.FillPlayedSongsLog,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillPlayedTitleSummary(fromDate, Todate,tokenid, ClientId){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ cDate: fromDate, tokenid:tokenid ,ToDate:Todate,ClientId:ClientId});
    return this.http.post(this.cApi.FillPlayedTitleSummary,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillMachineLogs(fromDate, Todate,tokenid, ClientId, ShowOnlyTankChangeLog){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ cDate: fromDate, tokenid:tokenid ,ToDate:Todate,ClientId:ClientId,ShowOnlyTankChangeLog:ShowOnlyTankChangeLog});
    return this.http.post(this.cApi.FillMachineLogs,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillPlayedAdSummary(fromDate, Todate,tokenid, ClientId){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ cDate: fromDate, tokenid:tokenid ,ToDate:Todate,ClientId:ClientId});
    return this.http.post(this.cApi.FillPlayedAdSummary,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
}
