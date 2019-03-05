import { Component, OnInit, Input } from "@angular/core";
import { InventoryItem } from "../models/inventory.item";
import { GiveawayService } from "../services/giveaway-service.service";
import { environment } from "../../environments/environment";
import { ItemCategory } from "../models/item.category";
import { SessionService } from '../services/user.session.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopupModalComponent } from '../popup-modal/popup-modal.component';
@Component({
  selector: "app-give-away",
  templateUrl: "./give-away.component.html",
  styleUrls: ["./give-away.component.css"]
})
export class GiveAwayComponent implements OnInit {
  inventory: InventoryItem;
  inventoryId: string;
  selectedFiles: FileList;
  userRequestToken: string;
  itemCategoryList: ItemCategory[] = [];
  constructor(private serviceObj: GiveawayService, private sessionService: SessionService, private modalService: NgbModal) {}

  selectFile(event) {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles.length > 3) {
      event.target.files = null;
      alert("You can select maximum 3 images only!");
      this.selectedFiles = null;
    }
  }

  ngOnInit() {
    this.inventory = new InventoryItem();
    this.getItemCategories();
  }

  uploadFiles() {
    this.serviceObj
      .uploadFileServiceCall(
        this.selectedFiles,
        this.inventoryId,
        this.userRequestToken
      )
      .subscribe(response => {
        const messageToShow = "Thank you for submitting your #GiveAway request. Once approved by administrator, you will get a confirmation mail with further details.";
        const modalRef = this.modalService.open(PopupModalComponent);
        modalRef.componentInstance.thisModalContent = messageToShow;
      });
  }

  getItemCategories(): void {
    this.serviceObj
      .getServiceCall(
        environment.inventoryManagementBasUrl,
        "domain" + "/ItemCategory"
      )
      .subscribe(data => {
        var itemCategoryListResponse: ItemCategory[] = Object.assign(data);
        this.itemCategoryList = itemCategoryListResponse;
      }, this.serviceObj.handleError);
  }

  setItemCategoryChoice(event): void {
    this.inventory.itemCategory = event.target.value;
  }

  submitGiveAwayRequest(): void {
    this.inventory.userId = this.sessionService.getUserObjectFromSession()["userId"];
    this.inventory.itemCategoryId = this.getCategoryTypeIdUsingTypeCode(
      this.inventory.itemCategory
    );
    this.serviceObj
      .postServiceCall(
        this.inventory,
        environment.inventoryManagementBasUrl,
        "inventory/submit"
      )
      .subscribe(data => {
        this.inventoryId = data["inventoryId"];
        this.userRequestToken = data["userRequestToken"];
        this.uploadFiles();
      });
  }

  getCategoryTypeIdUsingTypeCode(typeCode: string): number {
    for (var i = 0; i < this.itemCategoryList.length; i++) {
      const itemCategory: ItemCategory = this.itemCategoryList[i];
      if (itemCategory.typeCode === typeCode) {
        return itemCategory.id;
      }
    }
    return null;
  }
}
