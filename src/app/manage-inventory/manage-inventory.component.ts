import { Component, OnInit } from '@angular/core';
import { GiveawayService } from '../services/giveaway-service.service';
import { SessionService } from '../services/user.session.service';
import { environment } from '../../environments/environment';
import { InventoryResponse } from '../models/inventory.response';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { Observable } from 'rxjs';
import { InventoryItem } from '../models/inventory.item';

@Component({
  selector: "app-manage-inventory",
  templateUrl: "./manage-inventory.component.html",
  styleUrls: ["./manage-inventory.component.css"]
})
export class ManageInventoryComponent implements OnInit {

  static serviceObj;
  static modalServiceObj;
  static sessionServiceObj;
  static globalInventoryResponseList: InventoryResponse[];
  static inventoryResponseList: InventoryResponse[];
  userEnteredRequestToken: string = "";
  userEnteredRecipientAddress: string = "";
  userEnteredRequestCount: number = null;
  static approvedInventoryItemResponses: InventoryResponse[];
  columnDefs = [
    { headerName: "Token Number", field: "userRequestToken", resizable: true },
    { headerName: "Item Count", field: "availableItemCount", resizable: true },
    {
      headerName: "Item Picture",
      field: "itemUploadedFilePath",
      resizable: true,
      cellRenderer: function (param) {
        return '<img src="' + param.value + '" />';
      }
    },
    { headerName: "Item Category", field: "itemCategory", resizable: true },
    { headerName: "Item Name", field: "inventoryItemName", resizable: true },
    {
      headerName: "Item Description",
      field: "itemDescription",
      resizable: true
    },
    { headerName: "Current Status", field: "donationStatus", resizable: true },
    {
      headerName: "Warehouse Address",
      field: "itemWareHouseAddress",
      resizable: true
    },
    {
      headerName: "",
      field: "userActionApprove",
      resizable: false,
      autoHeight: true,
      width: 85,
      cellRenderer: function (param) {
        if (param.value === "WaitingForAdminApproval") {
          return '<button style="width:70px;" type="button" class="btn btn-outline-primary btn-sm" >Approve</button>';
        } else {
          return '<button disabled style="width:70px;" type="button" class="btn btn-outline-primary btn-sm" >Approve</button>';
        }
      },
      onCellClicked: function (params) {
        if (params.data.donationStatus === "WaitingForAdminApproval") {
          ManageInventoryComponent.approveThisRequest(params);
        }
      }
    },
    {
      headerName: "",
      field: "userActionReject",
      resizable: false,
      autoHeight: true,
      width: 85,
      cellRenderer: function (param) {
        if (param.value === "WaitingForAdminApproval") {
          return '<button style="width:70px;" type="button" class="btn btn-outline-danger btn-sm" >Reject</button>';
        } else {
          return '<button disabled style="width:70px;" type="button" class="btn btn-outline-danger btn-sm" >Reject</button>';
        }
      },
      onCellClicked: function (params) {
        if (params.data.donationStatus === "WaitingForAdminApproval") {
          ManageInventoryComponent.rejectThisRequest(params);
        }
      }
    },
    {
      headerName: "",
      field: "userActionItemCollected",
      resizable: false,
      autoHeight: true,
      width: 85,
      cellRenderer: function (param) {
        if (param.value === "WaitingForCollection") {
          return '<button style="width:70px;" type="button" class="btn btn-outline-primary btn-sm" >Collected</button>';
        } else {
          return '<button disabled style="width:70px;" type="button" class="btn btn-outline-primary btn-sm" >Collected</button>';
        }
      },
      onCellClicked: function (params) {
        if (params.data.donationStatus === "WaitingForCollection") {
          ManageInventoryComponent.itemCollectedAtSource(params);
        }
      }
    }
  ];

  rowData = [];

  columnDefs2 = [
    { headerName: "Token Number", field: "userRequestToken", resizable: true },
    { headerName: "Item Category", field: "itemCategory", resizable: true },
    { headerName: "Item Name", field: "inventoryItemName", resizable: true },
    {
      headerName: "Item Description",
      field: "itemDescription",
      resizable: true
    },
    {
      headerName: "Requested Item Count",
      field: "requestedItemCount",
      resizable: true
    },
    {
      headerName: "Warehouse Address",
      field: "itemWareHouseAddress",
      resizable: true
    },
    {
      headerName: "Requestor UserId",
      field: "requestorUserIdField",
      resizable: true
    },
    {
      headerName: "",
      field: "userActionRequestApproval",
      resizable: false,
      autoHeight: true,
      width: 85,
      cellRenderer: function (param) {
        if (
          param.value === "ItemRequestedByVolunteer"
        ) {
          return '<button style="width:70px;" type="button" class="btn btn-primary btn-sm" >Approve</button>';
        } else {
          return 'Acquired by Volunteer';
        }
      },
      onCellClicked: function (params) {
        if (
          ManageInventoryComponent.sessionServiceObj.getUserObjectFromSession()
            .userRole === "appAdmin"
        ) {
          ManageInventoryComponent.approveRequestedInventoryItem(params);
        }
      }
    }
  ];
  rowData2 = [];

  columnDefs3 = [
    { headerName: "Token Number", field: "userRequestToken", resizable: true },
    { headerName: "Item Category", field: "itemCategory", resizable: true },
    { headerName: "Item Name", field: "inventoryItemName", resizable: true },
    {
      headerName: "Item Description",
      field: "itemDescription",
      resizable: true
    },
    {
      headerName: "Current Status",
      field: "itemCurrentStatus",
      resizable: true
    },
    {
      headerName: "Recipient Address",
      field: "recipientAddressTextbox",
      resizable: false,
      autoHeight: true
    }

  ];
  rowData3 = [];

  constructor(
    private serviceObject: GiveawayService,
    private sessionService: SessionService,
    private modalService: NgbModal
  ) {
    ManageInventoryComponent.serviceObj = serviceObject;
    ManageInventoryComponent.modalServiceObj = modalService;
    ManageInventoryComponent.sessionServiceObj = sessionService;
    this.getAllInventoryDetails();
    this.getRequestedInventoryDetails();
  }

  ngOnInit() { }

  static approveThisRequest(params) {
    const modalRef = ManageInventoryComponent.modalServiceObj.open(
      ConfirmationModalComponent
    );
    modalRef.result.then(
      data => {
        ManageInventoryComponent.updateInventoryItemStatus(
          params.data.userRequestToken,
          "approve",
          0, 0
        );
      },
      reason => {
        // do nothing...
      }
    );
  }

  static rejectThisRequest(params) {
    const modalRef = ManageInventoryComponent.modalServiceObj.open(
      ConfirmationModalComponent
    );
    modalRef.result.then(
      data => {
        ManageInventoryComponent.updateInventoryItemStatus(
          params.data.userRequestToken,
          "reject",
          0, 0
        );
      },
      reason => {
        // do nothing...
      }
    );
  }

  static itemCollectedAtSource(params) {
    const modalRef = ManageInventoryComponent.modalServiceObj.open(
      ConfirmationModalComponent
    );
    modalRef.result.then(
      data => {
        ManageInventoryComponent.updateInventoryItemStatus(
          params.data.userRequestToken,
          "collected",
          0, 0
        );
      },
      reason => {
        // do nothing...
      }
    );
  }

  requestInventoryItem() {
    const modalRef = ManageInventoryComponent.modalServiceObj.open(
      ConfirmationModalComponent
    );
    modalRef.result.then(
      data => {
        const requestorId = ManageInventoryComponent.sessionServiceObj.getUserObjectFromSession()
          .userId;
        const response = ManageInventoryComponent.updateInventoryItemStatus(
          this.userEnteredRequestToken,
          "requestItem",
          requestorId, this.userEnteredRequestCount
        );
        if (response != null && response != undefined) {
          this.getRequestedInventoryDetails();
        }
      },
      reason => {
        // do nothing...
      }
    );
  }

  static approveRequestedInventoryItem(params) {
    const modalRef = ManageInventoryComponent.modalServiceObj.open(
      ConfirmationModalComponent
    );
    modalRef.result.then(
      data => {
        const requestorId = params.data.requestorUserIdField;
        ManageInventoryComponent.updateInventoryItemStatus(
          params.data.userRequestToken,
          "approveRequest",
          requestorId, 0
        );
      },
      reason => {
        // do nothing...
      }
    );
  }

  getAllInventoryDetails(): void {
    this.serviceObject
      .getServiceCall(
        environment.inventoryManagementBasUrl,
        "inventory" +
        "/all/" +
        this.sessionService.getUserObjectFromSession().userRole
      )
      .subscribe(data => {
        ManageInventoryComponent.globalInventoryResponseList = Object.assign(data);
        const inventoryResponseList: InventoryResponse[] = Object.assign(data);
        const tempArray = [];
        for (var i = 0; i < inventoryResponseList.length; i++) {
          const currInventoryResponse = inventoryResponseList[i];
          const currentRowData = {};
          currentRowData["userRequestToken"] =
            currInventoryResponse.userRequestToken;
          currentRowData["availableItemCount"] = currInventoryResponse.donatedItemCount;
          currentRowData["itemUploadedFilePath"] =
            currInventoryResponse.itemUploadedFilePath;
          currentRowData["itemCategory"] = currInventoryResponse.itemCategory;
          currentRowData["inventoryItemName"] =
            currInventoryResponse.inventoryItemName;
          currentRowData["itemDescription"] =
            currInventoryResponse.itemDescription;
          currentRowData["donationStatus"] =
            currInventoryResponse.donationStatus;
          currentRowData["itemWareHouseAddress"] =
            currInventoryResponse.itemWareHouseAddress;
          currentRowData["userActionApprove"] =
            currInventoryResponse.donationStatus;
          currentRowData["userActionReject"] =
            currInventoryResponse.donationStatus;
          currentRowData["userActionItemCollected"] =
            currInventoryResponse.donationStatus;
          tempArray.push(currentRowData);
        }
        this.rowData = tempArray;
      }, this.serviceObject.handleError);
  }

  static updateInventoryItemStatus(userToken, status, requestorId, requestedItemCount): Observable<Object> {
    const resourceURL =
      "inventory/approve/" + userToken + "/" + status + "/" + requestorId + "/" + requestedItemCount;
    return ManageInventoryComponent.serviceObj
      .postServiceCall(null, environment.inventoryManagementBasUrl, resourceURL)
      .subscribe();
  }

  getRequestedInventoryDetails(): void {
    const loggedInUserRole = this.sessionService.getUserObjectFromSession()
      .userRole;
    var userId;
    if (loggedInUserRole === "outVolUser") {
      userId = this.sessionService.getUserObjectFromSession().userId;
    } else {
      userId = 0;
    }
    this.serviceObject
      .getServiceCall(
        environment.inventoryManagementBasUrl,
        "inventory" + "/requested/" + userId
      )
      .subscribe(data => {
        const inventoryResponseList: InventoryResponse[] = Object.assign(data);
        ManageInventoryComponent.inventoryResponseList = inventoryResponseList;
        const tempArray = [];
        for (var i = 0; i < inventoryResponseList.length; i++) {
          const currInventoryResponse = inventoryResponseList[i];
          const currentRowData = {};
          currentRowData["userRequestToken"] =
            currInventoryResponse.userRequestToken;
          currentRowData["itemCategory"] = currInventoryResponse.itemCategory;
          currentRowData["inventoryItemName"] =
            currInventoryResponse.inventoryItemName;
          currentRowData["itemDescription"] =
            currInventoryResponse.itemDescription;
          currentRowData["itemCurrentStatus"] =
            currInventoryResponse.donationStatus;
          currentRowData["requestedItemCount"] =
            currInventoryResponse.requestedItemCount;
          currentRowData["itemWareHouseAddress"] =
            currInventoryResponse.itemWareHouseAddress;
          currentRowData["requestorUserIdField"] =
            currInventoryResponse.itemRequestedByUser;
          currentRowData["userActionRequestApproval"] =
            currInventoryResponse.donationStatus;
          tempArray.push(currentRowData);
        }
        this.rowData2 = tempArray;
        this.getApprovedItemInventoryDetails();
      }, this.serviceObject.handleError);
  }

  getApprovedItemInventoryDetails(): void {
    const inventoryResponseList: InventoryResponse[] = ManageInventoryComponent.inventoryResponseList;
    const loggedInUserId = this.sessionService.getUserObjectFromSession().userId;
    const approvedInventoryItemResponses: InventoryResponse[] = [];
    for (var i = 0; i < inventoryResponseList.length; i++) {
      if (inventoryResponseList[i].itemRequestedByUser == loggedInUserId && inventoryResponseList[i].donationStatus === "ItemAcquiredByVolunteer") {
        approvedInventoryItemResponses.push(inventoryResponseList[i]);
      }
    }
    ManageInventoryComponent.approvedInventoryItemResponses = approvedInventoryItemResponses;
    const tempArray = [];
    for (var i = 0; i < approvedInventoryItemResponses.length; i++) {
      const currInventoryResponse = approvedInventoryItemResponses[i];
      const currentRowData = {};
      currentRowData["userRequestToken"] =
        currInventoryResponse.userRequestToken;
      currentRowData["itemCategory"] = currInventoryResponse.itemCategory;
      currentRowData["inventoryItemName"] =
        currInventoryResponse.inventoryItemName;
      currentRowData["itemDescription"] =
        currInventoryResponse.itemDescription;
      currentRowData["itemCurrentStatus"] =
        currInventoryResponse.donationStatus;
      currentRowData["recipientAddressTextbox"] =
        "";
      tempArray.push(currentRowData);
    }
    this.rowData3 = tempArray;
  }

  checkIfRequestButtonShouldBeEnabled(): boolean {
    const inventoryList: InventoryResponse[] = ManageInventoryComponent.globalInventoryResponseList;
    if (inventoryList != undefined) {
      for (var i = 0; i < inventoryList.length; i++) {
        if (this.userEnteredRequestToken === inventoryList[i].userRequestToken
          && inventoryList[i].donationStatus === "ItemCollected"
          && inventoryList[i].donatedItemCount >= this.userEnteredRequestCount) {
          return false;
        }
      }
    }
    return true;
  }

  checkIfDonatedButtonShouldBeEnabled(): boolean {
    const inventoryList: InventoryResponse[] = ManageInventoryComponent.approvedInventoryItemResponses;
    if (inventoryList != undefined) {
      for (var i = 0; i < inventoryList.length; i++) {
        if (this.userEnteredRequestToken === inventoryList[i].userRequestToken
          && inventoryList[i].donationStatus === "ItemAcquiredByVolunteer" && inventoryList[i].itemRequestedByUser == ManageInventoryComponent.sessionServiceObj.getUserObjectFromSession().userId) {
            this.userEnteredRequestCount = inventoryList[i].donatedItemCount;
            return false;
        }
      }
    }
    return true;
  }

  submitItemToRecipient(): void {
    const invRequestBody: InventoryItem = new InventoryItem();
    invRequestBody.userRequestToken = this.userEnteredRequestToken;
    invRequestBody.recipientAddress = this.userEnteredRecipientAddress;
    invRequestBody.itemCount = this.userEnteredRequestCount;
    invRequestBody.itemRequestorId = this.sessionService.getUserObjectFromSession().userId;
    this.serviceObject
      .postServiceCall(invRequestBody,
        environment.inventoryManagementBasUrl,
        "inventory" + "/delivered"
      )
      .subscribe(data => {
      });
  }
}
