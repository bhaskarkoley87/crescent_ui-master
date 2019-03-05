import { Component, OnInit } from '@angular/core';
import { GiveawayService } from '../services/giveaway-service.service';
import { environment } from '../../environments/environment';
import { SessionService } from '../services/user.session.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {

  currentClass: any;

  
  columnDefs = [
    { headerName: 'User Id', field: 'userId', resizable: true },
    { headerName: 'User Role', field: 'userRole', resizable: true },
    { headerName: 'Username', field: 'userName', resizable: true },
    { headerName: 'Full Name', field: 'userFullName', resizable: true },
    { headerName: 'User Email', field: 'userEmail', resizable: true },
    { headerName: 'Mobile', field: 'userMobile', resizable: true },
    { headerName: 'Registration Status', field: 'userApproved', resizable: true },
    { headerName: 'Action', field: 'userAction', resizable: false, autoHeight: true, width: 85, cellRenderer: function(param) {
      const returnedCellValueArray = (param.value).split("_");
      const userId = returnedCellValueArray[0];
      const userStatus = returnedCellValueArray[1];
      if (userStatus === "true") {
        return '<button style="width:70px;" type="button" class="btn btn-outline-danger btn-sm" >Reject</button>';
      } else {
        return '<button style="width:70px;" type="button" class="btn btn-outline-primary btn-sm" >Approve</button>';
      }
    }, onCellClicked: function (params) {
       AllUsersComponent.approveRejectThisUser(params);
  }, }
  ];

  rowData = [];

  usersList: User[] = [];

  constructor(private serviceObject: GiveawayService, private sessionService: SessionService) {
    this.getAllUsersDetails();
  }

  ngOnInit() {
  }

  static approveRejectThisUser(params) {
    console.log(params.node.data);
  }

  getAllUsersDetails(): void {
    this.serviceObject
      .getServiceCall(
        environment.userManagementBaseUrl,
        "users" + "/all"
      )
      .subscribe(data => {
        //this.rowData = data;
        this.usersList = Object.assign(data);
        const tempArray = [];
        for (var i = 0; i < this.usersList.length; i++) {
          const currUserResponse = this.usersList[i];
          const currentRowData = {};
          currentRowData["userId"] = currUserResponse.userId;
          currentRowData["userRole"] = currUserResponse.userRole;
          currentRowData["userName"] = currUserResponse.userName;
          currentRowData["userFullName"] = currUserResponse.userFirstName + " " + currUserResponse.userLastName;
          currentRowData["userEmail"] = currUserResponse.userEmail;
          currentRowData["userMobile"] = currUserResponse.userMobile;
          currentRowData["userApproved"] = currUserResponse.userApproved;
          currentRowData["userAction"] = currUserResponse.userId + "_" + currUserResponse.userApproved;
          tempArray.push(currentRowData);
        }
        this.rowData = tempArray;
      }, this.serviceObject.handleError);
  }

}
