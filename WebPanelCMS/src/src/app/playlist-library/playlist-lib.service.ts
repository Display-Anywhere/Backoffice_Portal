import { Injectable } from '@angular/core';
import { ConfigAPI } from '../class/ConfigAPI';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistLibService {

  constructor(private http: HttpClient, private cApi: ConfigAPI, public auth: AuthService) { }
  FillCombo(query: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({ Query: query });
    return this.http.post(this.cApi.FillQueryCombo, params, { headers })
      .pipe((data => data));
  }
  Playlist(id: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({ Id: id });
    return this.http.post(this.cApi.Playlist, params, { headers })
      .pipe((data => data));
  }
  PlaylistSong(id: string, IsBestOffPlaylist: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({ playlistid: id, IsBestOffPlaylist });
    return this.http.post(this.cApi.PlaylistSong, params, { headers })
      .pipe((data => data));
  }
  CommanSearch(type, text, mediaType, IsExplicit, PageNo, ClientId) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({
      searchType: type, searchText: text, mediaType,
      IsRf: localStorage.getItem('IsRf'), ClientId,
      IsExplicit, IsAdmin: this.auth.IsAdminLogin$.value, DBType: localStorage.getItem('DBType'),
      ContentType: localStorage.getItem('ContentType'), PageNo,
      LoginClientId: localStorage.getItem('dfClientId'),IsAnnouncement:localStorage.getItem('IsAnnouncement')
    });
    return this.http.post(this.cApi.CommanSearch, params, { headers })
      .pipe((data => data));
  }
  DeleteTitle(pid, tid, IsBestOffPlaylist) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({ playlistid: pid, titleid: tid, IsBestOffPlaylist });
    return this.http.post(this.cApi.DeleteTitle, params, { headers })
      .pipe((data => data));
  }
  SavePlaylist(json: JSON) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = json;
    return this.http.post(this.cApi.SavePlaylist, params, { headers })
      .pipe((data => data));
  }
  SavePlaylistFromBestOf(id, plName, formatid, isBestOff) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({ id, plName, formatid, isBestOff });
    return this.http.post(this.cApi.SavePlaylistFromBestOf, params, { headers })
      .pipe((data => data));
  }
  AddPlaylistSong(playlistid, titleid, AddSongFrom,IsDuplicate) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({
      playlistid, titleid,
      AddSongFrom, IsDuplicate: IsDuplicate
    });
    return this.http.post(this.cApi.AddPlaylistSong, params, { headers })
      .pipe((data => data));
  }
  FillSongList(mediaType, IsExplicit, ClientId) {
    const params = JSON.stringify({
      searchType: '', searchText: '', mediaType,
      IsRf: localStorage.getItem('IsRf'), ClientId, IsExplicit,
      IsAdmin: this.auth.IsAdminLogin$.value, DBType: localStorage.getItem('DBType'),
      ContentType: localStorage.getItem('ContentType'), PageNo: '1',
      LoginClientId: localStorage.getItem('dfClientId'),IsAnnouncement:localStorage.getItem('IsAnnouncement')
    });
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.cApi.SongList, params, { headers })
      .pipe((data => data));
  }
  DeletePlaylist(pid, forceDelete) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({ playlistid: pid, titleid: '', IsBestOffPlaylist: '', IsForceDelete: forceDelete });
    return this.http.post(this.cApi.DeletePlaylist, params, { headers })
      .pipe((data => data));
  }
  SaveFormat(id, fname, ClientId, MediaType) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({
      id, formatname: fname,
      dfclientId: ClientId, DBType: localStorage.getItem('DBType'), MediaType:MediaType
    });
    return this.http.post(this.cApi.SaveFormat, params, { headers })
      .pipe((data => data));
  }
  SettingPlaylist(pid, chkMute, chkFixed, Mixed,Duplicate) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({ playlistid: pid, chkMute, chkFixed, chkMixed: Mixed, chkDuplicate: Duplicate });
    return this.http.post(this.cApi.SettingPlaylist, params, { headers })
      .pipe((data => data));
  }
  UpdatePlaylistSRNo(pid, json) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({ playlistid: pid, lstTitleSR: json });

    return this.http.post(this.cApi.UpdatePlaylistSRNo, params, { headers })
      .pipe((data => data));
  }


  SaveModifyLogs(tokenid: string, ModifyData: string) {
    const UserId = localStorage.getItem('UserId');
    const dfclientid = localStorage.getItem('dfClientId');
    const IPAddress = localStorage.getItem('ipAddress');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({ dfclientid, IPAddress, ModifyData, UserId, EffectToken: tokenid });
    return this.http.post(this.cApi.SaveModifyLogs, params, { headers })
      .pipe((data => data));
  }
  DeleteFormat(id, IsForceDelete) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({ formatId: id, IsForceDelete });
    return this.http.post(this.cApi.DeleteFormat, params, { headers })
      .pipe((data => data));
  }
  FillTokenInfo_formatANDplaylist(formatId, playlistId) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({ formatId, playlistId });
    return this.http.post(this.cApi.FillTokenInfo_formatANDplaylist, params, { headers })
      .pipe((data => data));
  }
  CopyFormat(FormatId, CopyFormatId, ClientId) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({ FormatId, CopyFormatId, dfclientId: ClientId });
    return this.http.post(this.cApi.CopyFormat, params, { headers })
      .pipe((data => data));
  }
  DeleteTitlePercentage(pid, tPercentage) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({ playlistid: pid, titlepercentage: tPercentage });

    return this.http.post(this.cApi.DeleteTitlePercentage, params, { headers })
      .pipe((data => data));
  }
  UpdateEnergyLevel(TitleId, EnergyLevel) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({ TitleId, EnergyLevel });
    return this.http.post(this.cApi.UpdateEnergyLevel, params, { headers })
      .pipe((data => data));
  }
  UpdateContent(TitleId, titleName) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({ TitleId, titleName });
    return this.http.post(this.cApi.UpdateContent, params, { headers })
      .pipe((data => data));
  }
  GetClientContenType(clientId: string | number) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({ clientId });
    return this.http.post(this.cApi.GetClientContenType, params, { headers })
      .pipe((data => data));
  }
  SaveImageTimeInterval(frmValue: any[]) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify(frmValue);
    return this.http.post(this.cApi.SaveImageTimeInterval, params, { headers })
      .pipe((data => data));
  }
  DeleteTitleOwn(tid, ForceType) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = JSON.stringify({ tid, ForceType });
    return this.http.post(this.cApi.DeleteTitleOwn, params, { headers })
      .pipe((data => data));
  }
}
