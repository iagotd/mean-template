import { Component, OnInit } from '@angular/core';
import { ThingService } from '../thing.service';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {

  events = []
  constructor(private _thingService: ThingService) { }

  ngOnInit(): void {
    this._thingService.getAdminEvents()
      .subscribe(
        res => this.events = res,
        err => console.log(err)
      )
  }

}
