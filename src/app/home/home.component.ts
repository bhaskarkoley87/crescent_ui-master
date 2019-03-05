import { Component, OnInit } from '@angular/core';
import {GiveawayService} from '../services/giveaway-service.service';
import {EventBean} from '../models/event-bean';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  endpointUrl= environment.endpoint;
  eventbean: any;
  constructor(private giveAway:GiveawayService) { }

  ngOnInit() {
    /*this.giveAway.getEvent().subscribe((data:  Array<EventBean>) => {
      this.eventbean  =  data;
      console.log(data);
  }); */
  }

   getClassForIteration(indexNumber:number) {
    if(indexNumber%2==0) {
      return "col-lg-6 order-lg-2";
    } else {
      return "col-lg-6";
    }
  }

  getClassForIteration2(indexNumber:number) {
    if(indexNumber%2==0) {
      return "col-lg-6 order-lg-1";
    } else {
      return "col-lg-6";
    }
  }
  

}
