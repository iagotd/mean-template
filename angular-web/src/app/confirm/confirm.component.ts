import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

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
          this._router.navigate(['/welcome'])
        },
        err => console.log(err)
      );
    }
  }
}
