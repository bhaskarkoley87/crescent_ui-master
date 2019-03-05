import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { GiveawayService } from '../services/giveaway-service.service';
import { environment } from '../../environments/environment';
import { SessionService } from '../services/user.session.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopupModalComponent } from '../popup-modal/popup-modal.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  user: User;

  constructor(private serviceObject: GiveawayService, private routerObj: Router, private sessionService : SessionService, private modalService : NgbModal) {

  }

  ngOnInit() {
    this.user = new User();
  }

  createUser(): void {
    this.serviceObject.postServiceCall(this.user, environment.userManagementBaseUrl, "register")
      .subscribe(
        data => {
          if (data["userApproved"]) {
            const messageToShow = "Please login to contiue...";
            const modalRef = this.modalService.open(PopupModalComponent);
            modalRef.componentInstance.thisModalContent = messageToShow;
            this.routerObj.navigateByUrl("/login");
          } else {
            const messageToShow = "Your approval for joining this platform is in progress. Once approved, you will get a confirmation mail, post which use your credentials to login.";
            const modalRef = this.modalService.open(PopupModalComponent);
            modalRef.componentInstance.thisModalContent = messageToShow;
            this.routerObj.navigateByUrl("/login");
          }
        }, this.serviceObject.handleError);
  };
}
