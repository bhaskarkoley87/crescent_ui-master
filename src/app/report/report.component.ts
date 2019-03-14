import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { GiveawayService } from '../services/giveaway-service.service';
import { SessionService } from '../services/user.session.service';
import {environment} from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  inventryReportData: any[] = [];
  constructor(private serviceObject: GiveawayService, private sessionService: SessionService, private myRoute: Router) {
    
   }

  ngOnInit() {
    if(!this.sessionService.isUserSessionAlive()){
      this.myRoute.navigateByUrl("/home");
    }else{
      this.getInventryReport();
    }
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

  /*public randomize(): void {
    // Only Change 3 values
    const data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    const clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
    
}*/

  public getInventryReport(): void{
    //this.barChartLabels = [];
    this.serviceObject
    .getServiceCall(
      environment.reportendpont,
      "report" + "/inventry?itemCategory=null&itemStatus=WaitingForAdminApproval&qutrValue=0&yrValue=2019&userId=bhaskarkoley"
    )
    .subscribe(data => {
      //this.rowData = data;
      this.inventryReportData  =  Object.assign(data); 
     // console.log(JSON.stringify(this.inventryReportData));
      //for (var i = 0; i < this.inventryReportData.length; i++) {
        const currReportResponse = JSON.parse(this.inventryReportData[0]);
       // console.log(JSON.stringify(currReportResponse));
        const rowLabelData = [];      
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
              console.log(JSON.stringify(rowTempData));
              
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
        //this.barChartLabels = this.barTempChartLabels;
        console.log(JSON.stringify(this.barChartData));
    });


  }
}
