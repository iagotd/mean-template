import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  confirmText = "An unexpected error has occurred.";
  confirmData = {email: '', token: ''};
  constructor(private _route: ActivatedRoute,
              private _auth: AuthService,
              private _router: Router) { }

  ngOnInit(): void {

    this.confirmData.email = this._route.snapshot.paramMap.get('email');
    this.confirmData.token = this._route.snapshot.paramMap.get('token');

    if (this.confirmData.email !== null && this.confirmData.token !== null) {
      this._auth.confirmUser(this.confirmData)
      .subscribe(
        res => { 
          localStorage.setItem('justConfirmed', "true")
          this._router.navigate(['/confirm'])
        },
        err => console.log(err)
      );
    }

    let justReg = localStorage.getItem("justRegistered");
    let justConf = localStorage.getItem("justConfirmed");

    if(justConf === "true") {
      this.confirmText = "Account activated. Please, login to use our services.";
    } else if (justReg === "true") {
      this.confirmText = "Email sent. Please, activate your account to use our services";
    } else {
      this._router.navigate(['/home'])
    }
  }
}
