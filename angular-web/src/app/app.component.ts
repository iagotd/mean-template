import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-web'

  constructor(private _authService: AuthService) {}

  logoutUser() {
    this._authService.logoutUser()
  }

  isUser() {
    let userType = localStorage.getItem("userType");
    if(userType == "user" || userType == "premium" || userType == "admin"){
      return true;
    } else return false;
  }

  isPremium() {
    let userType = localStorage.getItem("userType");
    if(userType == "premium" || userType == "admin"){
      return true;
    } else return false;
  }

  isAdmin() {
    let userType = localStorage.getItem("userType");
    if(userType == "admin"){
      return true;
    } else return false;
  }

}