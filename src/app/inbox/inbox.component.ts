import { Component, OnInit } from '@angular/core';
import { GiveawayService } from '../services/giveaway-service.service';
import { environment } from '../../environments/environment';
import { SessionService } from '../services/user.session.service';
import { Mail } from '../models/mail.model';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  columnDefs = [
    {headerName: 'Subject', field: 'mail_subject' },
    {headerName: 'Message', field: 'mail_message' },
    {headerName: 'From', field: 'mail_from'},
    {headerName: 'Date', field: 'mail_date'}
  ];

  rowData = [];

  mailList: Mail[] = [];

  constructor(private serviceObject: GiveawayService, private sessionService: SessionService) {
    this.getAllMailForUser();
  }

  ngOnInit() {
  }

  getAllMailForUser(): void {
    this.serviceObject
      .getServiceCall(
        environment.mailBasUrl,
        "mailer" + "/getinbox/?email="+ this.sessionService.getUserObjectFromSession()["userEmail"]
      )
      .subscribe(data => {
        //this.rowData = data;
        this.mailList = Object.assign(data);
        const tempArray = [];
        for (var i = 0; i < this.mailList.length; i++) {
          const currUserResponse = this.mailList[i];
          const currentRowData = {};
          currentRowData["mail_subject"] = currUserResponse.mailSubject;
          currentRowData["mail_message"] = currUserResponse.mailMessage;
          currentRowData["mail_date"] = currUserResponse.sendDate; 
          currentRowData["mail_from"] = currUserResponse.senderEmailId;         
          tempArray.push(currentRowData);
        }
        this.rowData = tempArray;
      }, this.serviceObject.handleError);
  }
}
