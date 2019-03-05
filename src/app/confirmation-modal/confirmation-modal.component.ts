import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit {

  static currentUserConfirmationResponse: string = "";

  constructor(public modal: NgbActiveModal) { }

  ngOnInit() {

  }


  confirmationModalAction(param: string): void {
    ConfirmationModalComponent.currentUserConfirmationResponse = param;
  }

  confirmationModalActionObserver(): Observable<boolean> {
    if (ConfirmationModalComponent.currentUserConfirmationResponse === "ok") {
      return new Observable<true>();
    } else if (ConfirmationModalComponent.currentUserConfirmationResponse === "cancel") {
      return new Observable<false>();
    }
  }

}
