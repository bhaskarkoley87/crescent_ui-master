import { Component, OnInit } from '@angular/core';
import { GiveawayService } from '../services/giveaway-service.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { GiveAwayComponent } from '../give-away/give-away.component';
import { ItemCategory } from '../models/item.category';
import { SessionService } from '../services/user.session.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  itemCategory: ItemCategory;

  currentActiveTab: string;

  constructor(private serviceObject: GiveawayService, private routerObj: Router, private sessionService: SessionService) { }

  ngOnInit() {
    this.currentActiveTab = "registerGiveAwayLink";
  }

  getClassForTabs(linkId: string): string {
    if (linkId === this.currentActiveTab) {
      return "nav-link active";
    } else {
      return "nav-link";
    }
  }

  clickedTab(linkId: string) : void {
    this.currentActiveTab = linkId;
  }
}
