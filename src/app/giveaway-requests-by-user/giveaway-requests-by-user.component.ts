import { Component, OnInit } from '@angular/core';
import { GiveawayService } from '../services/giveaway-service.service';
import { InventoryResponse } from '../models/inventory.response';
import { environment } from '../../environments/environment';
import { SessionService } from '../services/user.session.service';

@Component({
  selector: 'app-giveaway-requests-by-user',
  templateUrl: './giveaway-requests-by-user.component.html',
  styleUrls: ['./giveaway-requests-by-user.component.css']
})
export class GiveawayRequestsByUserComponent implements OnInit {

  columnDefs = [
    { headerName: 'Token Number', field: 'userRequestToken' },
    {
      headerName: 'Item Picture', field: 'itemUploadedFilePath', cellRenderer: function(param) {
        console.log(param.value);
        return '<img src="' + param.value +'" />';
      }
    },
    { headerName: 'Item Name', field: 'inventoryItemName' },
    { headerName: 'Item Description', field: 'itemDescription' },
    { headerName: 'Current Status', field: 'donationStatus' },
    { headerName: 'Warehouse Address', field: 'itemWareHouseAddress' }
  ];

  rowData = [];

  inventoryResponseList: InventoryResponse[] = [];

  constructor(private serviceObject: GiveawayService, private sessionService: SessionService) {
    this.getUserInventoryDetails();
  }

  ngOnInit() {

  }

  getUserInventoryDetails(): void {
    this.serviceObject
      .getServiceCall(
        environment.inventoryManagementBasUrl,
        "inventory" + "/userid/" + this.sessionService.getUserObjectFromSession().userId
      )
      .subscribe(data => {
        //this.rowData = data;
        this.inventoryResponseList = Object.assign(data);
        const tempArray = [];
        for (var i = 0; i < this.inventoryResponseList.length; i++) {
          const currInventoryResponse = this.inventoryResponseList[i];
          const currentRowData = {};
          currentRowData["userRequestToken"] = currInventoryResponse.userRequestToken;
          currentRowData["itemUploadedFilePath"] = currInventoryResponse.itemUploadedFilePath;
          currentRowData["inventoryItemName"] = currInventoryResponse.inventoryItemName;
          currentRowData["itemDescription"] = currInventoryResponse.itemDescription;
          currentRowData["donationStatus"] = currInventoryResponse.donationStatus;
          currentRowData["itemWareHouseAddress"] = currInventoryResponse.itemWareHouseAddress;
          tempArray.push(currentRowData);
        }
        this.rowData = tempArray;
      }, this.serviceObject.handleError);
  }

}
