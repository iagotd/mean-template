import { Component, OnInit } from '@angular/core';
import { ThingService } from '../thing.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

  events = []
  constructor(private _thingService: ThingService) { }

  ngOnInit(): void {
    this._thingService.getPremiumEvents()
      .subscribe(
        res => this.events = res,
        err => console.log(err)
      )
  }

}
