import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { GiveawayService } from '../services/giveaway-service.service';
import { environment } from '../../environments/environment';
import { SessionService } from '../services/user.session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User;

  constructor(private serviceObject: GiveawayService, private routerObj: Router, private sessionService: SessionService) {

  }

  ngOnInit() {
    this.user = new User();
  }

  loginUser(): void {
    this.serviceObject.postServiceCall(this.user, environment.userManagementBaseUrl, "login")
      .subscribe(
        data => {
          // if login is successfull, the user session is set and user is redirected to home page.
          this.sessionService.setUserSessionObj(data);
          if (data["userApproved"]) {
            this.sessionService.setIsUserLoggedIn("true");
          }
          this.routerObj.navigateByUrl("/home");
        }, this.serviceObject.handleError);
  };

  logoutUser(): void {
    this.sessionService.logoutUser();
    this.routerObj.navigateByUrl("/home");
  }

}
