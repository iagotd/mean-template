import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router} from '@angular/router'
import { of, Observable } from "rxjs";
import { tap, map } from "rxjs/operators";

@Injectable()
export class AuthService {

  private _registerUrl = "https://localhost:8443/api/register";
  private _loginUrl = "https://localhost:8443/api/login";
  private _confirmUrl = "https://localhost:8443/api/confirmation";
  private _verifyTokenUrl = "https://localhost:8443/api/verify-token";
  private _deleteUserUrl = "https://localhost:8443/api/delete"

  constructor(private http: HttpClient,
              private _router: Router) { }

  registerUser(user) {
    return this.http.post<any>(this._registerUrl, user)
  }

  verifyToken(): Observable<boolean> {
    const token = this.getToken();
    return token ? this.http
      .post(this._verifyTokenUrl, {
        'token': localStorage.getItem('token'),
        'userType': localStorage.getItem('userType')
      })
      .pipe(
        map(
          res => true,
          error => false
        )
      ) : of(false)
  }
  
  confirmUser(confirmData) {
    return this.http.post<any>(this._confirmUrl, confirmData)
  }

  loginUser(user) {
    return this.http.post<any>(this._loginUrl, user)
  }

  logoutUser() {
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    this._router.navigate(['/home'])
  }

  deleteUser(userData) {
    return this.http.post<any>(this._deleteUserUrl, userData)
  }

  getToken() {
    return localStorage.getItem('token')
  }
}