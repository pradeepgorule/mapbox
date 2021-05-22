import { Component, OnInit } from '@angular/core';
import { StateMapService } from '../state-map.service'

@Component({
  selector: 'app-state-map',
  templateUrl: './state-map.component.html',
  styleUrls: ['./state-map.component.css']
})
export class StateMapComponent implements OnInit {

  constructor(private map: StateMapService) { }

  ngOnInit() {

    this.map.buildMap()




  }
}
