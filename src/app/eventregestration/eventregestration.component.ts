import { Component, OnInit, Input } from '@angular/core';
import { GiveawayService } from '../services/giveaway-service.service';
import {EventBean} from '../models/event-bean';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Router } from '@angular/router';
import { SessionService } from '../services/user.session.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-eventregestration',
  templateUrl: './eventregestration.component.html',
  styleUrls: ['./eventregestration.component.css']
})
export class EventregestrationComponent implements OnInit {
  @Input() eventbean: EventBean;
  eventbeanResponse: EventBean[] = [];
  selectedFiles: FileList;
  public disabled: boolean = false;
  currentFileUpload: File;
  eventForm: FormGroup;
  submitted = false;
  progress: { percentage: number } = { percentage: 0 };
  constructor(private serviceObject: GiveawayService,
    private sessionService: SessionService, private formBuilder: FormBuilder, private myRoute: Router) { }

  ngOnInit() {
    this.eventbean = new EventBean();
    this.eventForm = this.formBuilder.group({
      eveName: ['', [Validators.required, Validators.minLength(20)]],
      eveDescription: ['', [Validators.required, Validators.minLength(100)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      //email: ['', [Validators.required, Validators.email]],
      //password: ['', [Validators.required, Validators.minLength(6)]],
     // confirmPassword: ['', Validators.required]
   }, {validator: this.dateLessThan('startDate', 'endDate')});
  }

  dateLessThan(from: string, to: string) {
    return (group: FormGroup): {[key: string]: any} => {
     let f = group.controls[from];
     let t = group.controls[to];
     if (f.value > t.value) {
       return {
         dates: "Date from should be less than Date to"
       };
     }
     return {};
    }
  }

  get f() { return this.eventForm.controls; }

  createEvent(): void {    
    if(this.progress.percentage >= 100){
      this.submitted = true;
      if (this.eventForm.invalid) {
        return;
      }

      console.log(this.eventbean);
      this.serviceObject
      .postServiceCall(this.eventbean,
        environment.endpoint,
        "event" + "/create"
      )
      .subscribe(data => {
        this.eventbeanResponse = Object.assign(data);
        console.log("Converted Data ::::: "+JSON.stringify(this.eventbeanResponse));
        this.eventForm.reset();
        console.log(this.eventbeanResponse["address"]);
        this.myRoute.navigateByUrl("/home");
      });     
    }else{
      alert("Please upload the image first..");
    }
    
  };

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }
  
  upload() {
    this.progress.percentage = 0;
 
    this.currentFileUpload = this.selectedFiles.item(0);
    this.serviceObject.pushFileToStorage(this.currentFileUpload).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        this.eventbean = JSON.parse(JSON.stringify(event.body));
        console.log(JSON.stringify(this.eventbean));
        if(this.progress.percentage == 100){
          this.disabled = true;
        }else{
          this.disabled = false;
        }
      }
    });
    console.log("The Return value ::::: "+JSON.stringify(this.eventbean));
    this.selectedFiles = undefined;
    
  }


  fromJSON(json) {
    for (var propName in json)
        this[propName] = json[propName];
    return this;
  }
}
