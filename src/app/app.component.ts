import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { Spinkit } from 'ng-http-loader';
import { HeadermastComponent } from './headermast/headermast.component';
import { SessionService } from './services/user.session.service'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public spinkit = Spinkit;
  appTitle = environment.projectTitle;
  
  constructor(private sessionService: SessionService) {

  }

  ngOnInit() {
  }
}
