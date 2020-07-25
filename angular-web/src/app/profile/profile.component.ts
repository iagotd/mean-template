import { Component, OnInit } from '@angular/core';
import { ThingService } from '../thing.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  events = []
  constructor(private _thingService: ThingService) { }

  ngOnInit(): void {
    this._thingService.getEvents()
      .subscribe(
        res => this.events = res,
        err => console.log(err)
      )
  }

}
