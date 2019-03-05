import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { FormsModule } from '@angular/forms';
import { EventregestrationComponent } from './eventregestration/eventregestration.component';
import { HttpClientModule } from '@angular/common/http';
import { GiveawayService } from './services/giveaway-service.service';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { InboxComponent } from './inbox/inbox.component';
import { HeadermastComponent } from './headermast/headermast.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeSliderComponent } from './home-slider/home-slider.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SessionService } from './services/user.session.service';
import { GiveAwayComponent } from './give-away/give-away.component';
import { AgGridModule } from 'ag-grid-angular';
import { GiveawayRequestsByUserComponent } from './giveaway-requests-by-user/giveaway-requests-by-user.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { ManageInventoryComponent } from './manage-inventory/manage-inventory.component';
import { OutreachUserRequestComponent } from './outreach-user-request/outreach-user-request.component';
import { PopupModalComponent } from './popup-modal/popup-modal.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    HomeComponent,
    EventregestrationComponent,
    InboxComponent,
    HeadermastComponent,
    HomeSliderComponent,
    DashboardComponent,
    GiveAwayComponent,
    GiveawayRequestsByUserComponent,
    AllUsersComponent,
    ManageInventoryComponent,
    OutreachUserRequestComponent,
    PopupModalComponent,
    ConfirmationModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgHttpLoaderModule.forRoot(),
    NgbModule,
    AgGridModule.withComponents([])
  ],
  providers: [GiveawayService, SessionService],
  bootstrap: [AppComponent],
  entryComponents: [PopupModalComponent, ConfirmationModalComponent]
})
export class AppModule {

}
