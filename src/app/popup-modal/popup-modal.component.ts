import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-popup-modal',
  templateUrl: './popup-modal.component.html'
})
export class PopupModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  thisModalContent: string = "";

  ngOnInit() {

  }
}