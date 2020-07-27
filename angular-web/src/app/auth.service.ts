import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router} from '@angular/router'
@Injectable()
export class AuthService {

  private _registerUrl = "https://localhost:8443/api/register";
  private _loginUrl = "https://localhost:8443/api/login";
  private _confirmUrl = "https://localhost:8443/api/confirmation";

  constructor(private http: HttpClient,
              private _router: Router) { }

  registerUser(user) {
    return this.http.post<any>(this._registerUrl, user)
  }

  confirmUser(confirmData) {
    return this.http.post<any>(this._confirmUrl, confirmData)
  }

  loginUser(user) {
    return this.http.post<any>(this._loginUrl, user)
  }

  userLoggedIn() {
    let userType = localStorage.getItem('userType')
    if (userType === "user" || userType === "premium" || userType === "admin") {
      return true
    } else {
      return false
    }
  }

  premiumLoggedIn() {
    let userType = localStorage.getItem('userType')
    if (userType === "premium" || userType === "admin") {
      return true
    } else {
      return false
    }
  }

  adminLoggedIn() {
    let userType = localStorage.getItem('userType')
    if (userType === "admin") {
      return true
    } else {
      return false
    }
  }

  logoutUser() {
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    this._router.navigate(['/home'])
  }

  getToken() {
    return localStorage.getItem('token')
  }
}