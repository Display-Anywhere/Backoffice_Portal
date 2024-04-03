import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse   } from '@angular/common/http';
import { ConfigAPI } from 'app/class/ConfigAPI';
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
  CustomerLoginEmailVerify(email){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ email: email });
    return this.http.post(this.cApi.CustomerLoginEmailVerify,params,{headers:headers})
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
  getMicrosoftProfile() {
    this.http.get('https://graph.microsoft.com/v1.0/me')
      .subscribe(profile => {
        return profile;
      });
  }
  SendOTP(email,oCode){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ ClientEmail: email , oCode: oCode});
    return this.http.post(this.cApi.SendOTP,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
}
