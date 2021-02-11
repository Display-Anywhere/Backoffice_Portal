import { Injectable } from '@angular/core';
import {ConfigAPI} from '../../class/ConfigAPI';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PlayerlogsService {
 
  constructor(private http:HttpClient,private cApi:ConfigAPI) { }
  FillPlayedSongsLog(cDate){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ cDate: cDate, tokenid:localStorage.getItem("tokenid"),ToDate:cDate });
    return this.http.post(this.cApi.FillPlayedSongsLog,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillPlayedAdsLog(cDate){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ cDate: cDate, tokenid:localStorage.getItem("tokenid") });
    return this.http.post(this.cApi.FillPlayedAdsLog,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillPlayedSanitiserLog(cDate){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ cDate: cDate, tokenid:localStorage.getItem("tokenid"),ToDate:cDate });
    return this.http.post(this.cApi.FillPlayedSanitiserLog,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
}
