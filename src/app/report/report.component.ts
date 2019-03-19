import { Component, OnInit} from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { GiveawayService } from '../services/giveaway-service.service';
import { SessionService } from '../services/user.session.service';
import {environment} from '../../environments/environment';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Report } from '../models/report';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopupModalComponent } from '../popup-modal/popup-modal.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  dataURL: string;
  quarterMonth: string[] = [];  
  report: Report = null;

  inventryReportData: any[] = [];
  userList: any[] = [];
  constructor(private serviceObject: GiveawayService, private sessionService: SessionService, private myRoute: Router, private sanitizer: DomSanitizer, private modalService : NgbModal) {
     
   }

   onChangeQuarter(param){
     const utr = param.target.value;
     console.log(utr);
     this.quarterMonth = [];
     if(utr === "1"){
      this.quarterMonth.push("January");
      this.quarterMonth.push("February");
      this.quarterMonth.push("March");
     } else if(utr === "2"){
      this.quarterMonth.push("April");
      this.quarterMonth.push("May");
      this.quarterMonth.push("June");
     } else if(utr === "3"){
      this.quarterMonth.push("July");
      this.quarterMonth.push("August");
      this.quarterMonth.push("September");
     } else if(utr === "4"){
      this.quarterMonth.push("October");
      this.quarterMonth.push("November");
      this.quarterMonth.push("December");
     }   
    
   }

  ngOnInit() {
    if(!this.sessionService.isUserSessionAlive()){
      this.myRoute.navigateByUrl("/home");
    }else{
      this.report = new Report();
      this.userList = [];
      this.report.reportCategory = "null";
      this.report.reportMonth = "null";
      this.report.reportQuarter = "0";
      this.report.reportStauts = "null";
      this.report.reportYear = "2019";
      this.report.userId = "null";
      this.getUserList();
      this.getInventryReport(null, null, 0, 0, null, null);
    }
  }

  generateReport(): void{
    //console.log(this.report);
    this.barChartData = [];
    this.barTempChartData = [];
    this.getInventryReport(this.report.reportCategory, this.report.reportStauts, this.report.reportQuarter, this.report.reportYear, this.report.reportMonth, this.report.userId);
  }

  public getSantizeUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getReportDoc(){
    window.open(this.dataURL);
  }

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public months: String[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public barTempChartLabels: Label[] = [];
  public barChartLabels: Label[] =  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  //public barChartPlugins = [pluginDataLabels];

  public barTempChartData: ChartDataSets[] =[];
  public barChartData: ChartDataSets[] =[{"data":[0,4,2,0,0,0,0,0,0,0,0,0],"label":"Book"},{"data":[10,0,0,0,0,0,0,0,0,0,0,0],"label":"Dress"},{"data":[0,0,0,0,0,20,0,0,0,0,0,0],"label":"Blanket"}];/* [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];*/

   // events
   public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  

converBase64toBlob(content, contentType) {
  contentType = contentType || '';
  var sliceSize = 512;
  var byteCharacters = atob(content); //method which converts base64 to binary
  var byteArrays = [
  ];
  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);
    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  var blob = new Blob(byteArrays, {
    type: contentType
  }); //statement which creates the blob
  return blob;
}

  public getInventryReport(itmCat, itmstatus, qtrVal, yrVal, mntVal, itmUsr): void{
    //this.barChartLabels = [];
    
    this.serviceObject
    .getServiceCall(
      environment.reportendpont,
      "report" + "/inventry?itemCategory="+itmCat+"&itemStatus="+itmstatus+"&qutrValue="+qtrVal+"&yrValue="+yrVal+"&mntName="+mntVal+"&userId="+itmUsr+""
    )   
    .subscribe(data => {
      console.log(data);
      this.inventryReportData  =  Object.assign(data); 
      /*console.log(data.status);*/
      if(this.inventryReportData["errorCode"] != 200 && this.inventryReportData["errorCode"] != null){
        const messageToShow = this.inventryReportData["message"];
        const modalRef = this.modalService.open(PopupModalComponent);
        modalRef.componentInstance.thisModalContent = messageToShow;        
      }
      //this.rowData = data;
      
      
        var bindata = this.inventryReportData[1];
       // bindata = bindata.replace(/(\r\n|\n|\r)/gm, "");         
        var blob = this.converBase64toBlob(bindata, 'application/msexcel');
        var blobURL = URL.createObjectURL(blob);  
       
        this.dataURL = blobURL;
       
        


        const currReportResponse = JSON.parse(this.inventryReportData[0]);
        //console.log(this.inventryReportData[0]);
        //console.log("Size of Data :::: "+currReportResponse.length);
        const rowLabelData = [];      
        if(currReportResponse.length > 0){
          for (var i = 0; i < currReportResponse.length; i++) {
            const rowTempData = currReportResponse[i];
            if(rowLabelData.includes(rowTempData[0])== false){
              rowLabelData.push(rowTempData[0]);
            }       
            
           
          }
  
          var catData = {};
          var catMntwsData = {};
          for (var y = 0; y < rowLabelData.length; y++) {
            const crrntCat = rowLabelData[y];
            //mntName: String = "";
            const rowData = [];
            if(catData.hasOwnProperty(crrntCat)){
              catMntwsData = catData[crrntCat];
            }else{
              catMntwsData = {};
            }
            var value = "";
            
              for (var x = 0; x < currReportResponse.length; x++) {
                const rowTempData = currReportResponse[x];
                //console.log(JSON.stringify(rowTempData));
                
                  if(rowTempData[0] == crrntCat){    
                    for(var mnt = 0 ; mnt < this.months.length ; mnt++){
                     // mntName = this.months[mnt];
                      if(this.months[mnt]==rowTempData[5]){
                        value = rowTempData[2];
                      }else{
                        value = "0";
                      }
                      //rowData.push(value);
                      if(catMntwsData.hasOwnProperty(JSON.stringify(this.months[mnt]))){
                        catMntwsData[JSON.stringify(this.months[mnt])] = parseInt(catMntwsData[JSON.stringify(this.months[mnt])])+parseInt(value);
                      }else{
                        catMntwsData[JSON.stringify(this.months[mnt])] = parseInt(value);
                      }
                    }             
                    catData[crrntCat] = catMntwsData;
                  }
                
              }
             
             
             
             
           
           
          }     
  
          for (var key in catData) {
            const rowData = catData[key];
            const rowMonth = [];
            for(var key2 in rowData){
              rowMonth.push(rowData[key2]);
            }
            const actualRowData = {data : rowMonth, label : key};
            this.barTempChartData.push(actualRowData);
          }
          
         
  
          
          this.barChartData =  this.barTempChartData;
        }else{
          this.barChartData = [{"data":[0,0,0,0,0,0,0,0,0,0,0,0],"label":""}];
          this.barTempChartData = [];
        }
        
        //this.barChartLabels = this.barTempChartLabels;
        //console.log(JSON.stringify(this.barChartData));
    },error =>{
      
      this.serviceObject.handleError
    });


  }

  getUserList(): void{
    this.serviceObject.getServiceCall(
        environment.reportendpont,
        "report" + "/getUsers/"
      ).subscribe(data => {
        this.userList = Object.assign(data);
       //console.log(this.userList);
      }, this.serviceObject.handleError);
  }
}
