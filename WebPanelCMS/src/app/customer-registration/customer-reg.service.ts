import { Injectable } from '@angular/core';
import {ConfigAPI} from '../class/ConfigAPI';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CustomerRegService {

  constructor(private http: HttpClient, private cApi: ConfigAPI) { }
  FillCombo(query: string){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({ Query: query });
    return this.http.post(this.cApi.FillQueryCombo, params, {headers})
     .pipe((data => data));
  }
  FillCustomer(){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({ DBType: localStorage.getItem('DBType') });
    return this.http.post(this.cApi.FillCustomer, params, {headers})
     .pipe((data => data));
  }
  SaveCustomer(json: JSON){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = json;
    return this.http.post(this.cApi.SaveCustomer, params, {headers})
     .pipe((data => data));
  }
  EditClickCustomer(cid: string){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({clientId: cid});
    return this.http.post(this.cApi.EditClickCustomer, params, {headers})
     .pipe((data => data));
  }
  DeleteCustomer(cid: string){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({clientId: cid});
    return this.http.post(this.cApi.DeleteCustomer, params, {headers})
     .pipe((data => data));
  }
  SendMail(cid){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({clientId: cid, DBType: localStorage.getItem('DBType')});
    return this.http.post(this.cApi.SendMail, params, {headers})
     .pipe((data => data));
  }
  CitySateNewModify(id, name, type, stateid, CountryId){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({id, name, type, stateid, CountryId});
    return this.http.post(this.cApi.CitySateNewModify, params, {headers})
     .pipe((data => data));
  }
  ClientTemplateRegsiter(cid){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({clientId: cid, DBType: localStorage.getItem('DBType')});
    return this.http.post(this.cApi.ClientTemplateRegsiter, params, {headers})
     .pipe((data => data));
  }
  UpdateExpiryDate_Template_Creator(cid,status,expDate){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({dfClientId: cid, status: status,ExpiryDate:expDate});
    return this.http.post(this.cApi.UpdateExpiryDate_Template_Creator, params, {headers})
     .pipe((data => data));
  }
  UpdateClientStatus(aStatus,dfclientid,expiryDate){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({aStatus: aStatus, dfclientid: dfclientid,loginclientid:localStorage.getItem('loginclientid'),expiryDate:expiryDate});
    return this.http.post(this.cApi.UpdateClientStatus, params, {headers})
     .pipe((data => data));
  }
  GetClientLogs(ClientId){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({ClientId: ClientId});
    return this.http.post(this.cApi.GetClientLogs, params, {headers})
     .pipe((data => data));
  }
  UpdateClientKPNStatus(aStatus,dfclientid){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({aStatus: aStatus, dfclientid: dfclientid,loginclientid:null,expiryDate:null});
    return this.http.post(this.cApi.UpdateClientKPNStatus, params, {headers})
     .pipe((data => data));
  }
  UpdateClientSanitizerStatus(aStatus,dfclientid){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({aStatus: aStatus, dfclientid: dfclientid,loginclientid:null,expiryDate:null});
    return this.http.post(this.cApi.UpdateClientSanitizerStatus, params, {headers})
     .pipe((data => data));
  }
  UpdateServiceStatus(aStatus,dfclientid,sericeName){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({aStatus: aStatus, dfclientid: dfclientid,sericeName:sericeName});
    return this.http.post(this.cApi.UpdateServiceStatus, params, {headers})
     .pipe((data => data));
  }
}
