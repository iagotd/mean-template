import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUserData = {email: '', password: ''};
  constructor(private _auth: AuthService,
              private _router: Router) { }

  ngOnInit(): void {
    if(localStorage.getItem('token') && localStorage.getItem("userType")) {
      this._router.navigate(['/profile'])
    } else {
      if(localStorage.getItem('token')) localStorage.removeItem('token')
      if(localStorage.getItem('userType')) localStorage.removeItem('userType')
    }
  }

  loginUser() {
    this._auth.loginUser(this.loginUserData)
      .subscribe(
        res => { 
          console.log(res),
          localStorage.setItem('token', res.token)
          localStorage.setItem('userType', res.userType)
          this._router.navigate(['/profile'])
        },
        err => { 
          console.log("An error has occured: " + err.error);
          alert("An error has occured: " + err.error);
        }
      )
  }

}