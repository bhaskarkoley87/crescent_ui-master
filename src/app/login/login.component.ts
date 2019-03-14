import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
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

  @ViewChild("divInvalidMessage", {read: ElementRef}) divInvalidMessage: ElementRef;

  constructor(private serviceObject: GiveawayService, private routerObj: Router, private sessionService: SessionService,private renderer:Renderer2) {

  }

  ngOnInit() {
    this.user = new User();
  }

  loginUser(): void {
    this.serviceObject.postServiceCall(this.user, environment.userManagementBaseUrl, "login")
      .subscribe(
        data => {
          this.sessionService.setUserSessionObj(data);
          // if login is successfull, the user session is set and user is redirected to home page.
          if (data != null && data["userApproved"]) {
            this.sessionService.setIsUserLoggedIn("true");
            this.routerObj.navigateByUrl("/home");
          } else {
           // this.routerObj.navigateByUrl("/home");
           const childElements = this.divInvalidMessage.nativeElement.children;
            for (let child of childElements) {
              this.renderer.removeChild(this.divInvalidMessage.nativeElement, child);
            }
           let span=this.renderer.createElement('span');        
           const text = this.renderer.createText("* Invalid credential.");         
           this.renderer.appendChild(span, text);                        
           this.renderer.appendChild(this.divInvalidMessage.nativeElement, span);          
           
          }
          
        }, this.serviceObject.handleError);
  };

  logoutUser(): void {
    this.sessionService.logoutUser();
    this.routerObj.navigateByUrl("/home");
  }

}
