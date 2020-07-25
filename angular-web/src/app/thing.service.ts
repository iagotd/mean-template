import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ThingService {

  private _eventsUrl = "http://localhost:3000/api/events";
  private _premiumUrl = "http://localhost:3000/api/premium";
  private _adminUrl = "http://localhost:3000/api/admin";

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