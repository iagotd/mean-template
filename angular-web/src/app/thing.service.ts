import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ThingService {

  private _eventsUrl = "https://localhost:8443/api/events";
  private _premiumUrl = "https://localhost:8443/api/premium";
  private _adminUrl = "https://localhost:8443/api/admin";

  constructor(private http: HttpClient) { }

  getEvents() {
    return this.http.get<any>(this._eventsUrl + "?userType=" + localStorage.getItem("userType"))
  }

  getPremiumEvents() {
    return this.http.get<any>(this._premiumUrl + "?userType=" + localStorage.getItem("userType"))
  }

  getAdminEvents() {
    return this.http.get<any>(this._adminUrl + "?userType=" + localStorage.getItem("userType"))
  }

}