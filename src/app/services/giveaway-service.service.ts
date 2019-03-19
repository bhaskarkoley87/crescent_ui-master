import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpRequest,
  HttpEvent
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { environment } from "../../environments/environment";
import { EventBean } from "../models/event-bean";
import { SessionService } from "./user.session.service";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: "Basic " + btoa("loginUser:loginPassword")
  })
};
const httpOptionsForMultipart = {
  headers: new HttpHeaders({
    Authorization: "Basic " + btoa("loginUser:loginPassword")
  })
};

const httpOptionsForMultipartEvent = {
  headers: new HttpHeaders({
    Authorization: "Basic " + btoa("loginUser:loginPassword")
  }),
  reportProgress: true,
  responseType: 'json'
};

@Injectable({
  providedIn: "root"
})
export class GiveawayService {
  endpoint = environment.endpoint;
  eventbean: EventBean;

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) {}

  getEvent(): Observable<EventBean[]> {
    return this.http.get<EventBean[]>(`${this.endpoint}` + `event/get`);
   }
 
   ///*Function to call the REST API for Create Event*/
   addEvent(eventbean:EventBean): Observable<EventBean> {
     console.log(this.endpoint + 'event/create');
    // console.log(eventbean);
     return this.http.post<EventBean>(`${this.endpoint}` + `event/create`, eventbean);
   }

  //Function to upload files
  pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

    formdata.append("file", file);
    formdata.append(
      "userId",
      String(this.sessionService.getUserObjectFromSession()["userId"])
    );        
    const req = new HttpRequest(
      "POST",
      `${this.endpoint}` + `event/uploadimage`,
      formdata,
      {
        headers: new HttpHeaders({
          Authorization: "Basic " + btoa("loginUser:loginPassword")
        }),
        reportProgress: true,
        responseType: 'json'
      }
    );

    return this.http.request(req);
  }

  // For Error handeling
  public handleError<T>(operation = "operation", result?: T) {
    console.log("Error");
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.log("::::::::::::::::::: "+error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /* Function to call the REST API for POST type */
  postServiceCall(
    requestBody: Object,
    baseUrl: string,
    resourceUrl: string
  ): Observable<Object> {
    var response: any = null;
    var completeEndpointUrl: string = baseUrl + resourceUrl;
    return this.http.post(completeEndpointUrl, requestBody, httpOptions);
  }

  /* Function to call the REST API for GET type */
  getServiceCall(baseUrl: string, resourceUrl: string): Observable<Object> {
    var response: any = null;
    var completeEndpointUrl: string = baseUrl + resourceUrl;    
    return this.http.get(completeEndpointUrl, httpOptions);    
  }

  uploadFileServiceCall(
    fileListForUpload: FileList,
    inventoryId: string,
    userRequestToken: string
  ): Observable<Object> {
    for (var i = 0; i < fileListForUpload.length; i++) {
      const formdata: FormData = new FormData();
      formdata.append(
        "userId",
        String(this.sessionService.getUserObjectFromSession()["userId"])
      );
      formdata.append("inventoryId", inventoryId);
      formdata.append("userRequestToken", userRequestToken);
      const currentFile: File = fileListForUpload.item(i);
      formdata.append("file", currentFile);
      console.log(formdata);
      this.http
        .post(
          environment.inventoryManagementBasUrl + "files/upload",
          formdata,
          httpOptionsForMultipart
        )
        .subscribe();
    }
    return new Observable<true>();
  }
}
