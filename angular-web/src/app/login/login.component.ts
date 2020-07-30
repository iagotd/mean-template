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
  }

  loginUser() {
    console.log("User: " + this.loginUserData.email);
    console.log("Pass: " + this.loginUserData.password);
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