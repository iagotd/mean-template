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

  isLoggedIn() {
    return this._authService.userLoggedIn()
  }

  hasEnoughUserType(requiredUserType) {

    let userTypeNumber = 3;
    if(!this.isLoggedIn()) return false;

    switch(localStorage.getItem("userType")) {
      case "user" : {
        userTypeNumber = 2
        break
      }
      case "premium" : {
        userTypeNumber = 1
        break
      }
      case "admin" : {
        userTypeNumber = 0
        break
      }
      default: userTypeNumber = 3
    }
    if(userTypeNumber > requiredUserType) {
      return false
    } else {
      return true
    }
  }

}