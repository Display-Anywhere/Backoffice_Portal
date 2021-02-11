import { Injectable } from '@angular/core';
import {ConfigAPI} from '../class/ConfigAPI';
import { HttpClient, HttpHeaders,HttpErrorResponse   } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UloginService {

  constructor(private http:HttpClient,private cApi:ConfigAPI) { }
  uLogin(json:JSON){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = json;
    return this.http.post(this.cApi.uLogin,params,{headers:headers})
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
}
