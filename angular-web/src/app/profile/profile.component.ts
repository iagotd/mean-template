import { Component, OnInit } from '@angular/core';
import { ThingService } from '../thing.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  events = []
  constructor(private _thingService: ThingService,
              private _auth: AuthService,
              private _router: Router) { }

  ngOnInit(): void {
    this._thingService.getEvents()
      .subscribe(
        res => this.events = res,
        err => console.log(err)
      )
  }

  deleteAccount() {

    let userData = {
      "userType" : localStorage.getItem("userType"),
      "token" : localStorage.getItem("token")
    }

    this._auth.deleteUser(userData)
    .subscribe(
      res => { 
        console.log(res);
        localStorage.removeItem("userType");
        localStorage.removeItem("token");
        this._router.navigate(['/home']);
      },
      err => {
        console.log("An error has occured: " + err.error);
        alert("An error has occured: " + err.error);
      }
    )
  }

}
