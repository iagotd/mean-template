import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerUserData = {email: '', password: ''};
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

  registerUser() {
    this._auth.registerUser(this.registerUserData)
      .subscribe(
        res => { 
          console.log(res),
          this._router.navigate(['/confirm'])
        },
        err => {
          console.log("An error has occured: " + err.error);
          alert("An error has occured: " + err.error);
        }
      )
  }
}