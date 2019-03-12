import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { EventregestrationComponent } from './eventregestration/eventregestration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GiveAwayComponent } from './give-away/give-away.component';
import { GiveawayRequestsByUserComponent } from './giveaway-requests-by-user/giveaway-requests-by-user.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { ManageInventoryComponent } from './manage-inventory/manage-inventory.component';
import { InboxComponent } from './inbox/inbox.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: RegistrationComponent },
  { path: 'event', component: EventregestrationComponent },
  { path: 'inbox', component: InboxComponent },
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      { path: 'giveaway', component: GiveAwayComponent },
      { path: 'myrequests', component: GiveawayRequestsByUserComponent },
      { path: 'allusers', component: AllUsersComponent },
      { path: 'manageinventory', component: ManageInventoryComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
