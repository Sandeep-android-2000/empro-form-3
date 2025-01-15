import { HttpClient, HttpParams, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MulipleReportsService {
  constructor(private http: HttpClient) {}

  generateMultipleReports(
    dbUrl: string,
    dbUsername: string,
    dbPassword: string,
    exportFormat: string,
    reportName: string,
    subreportName:string,
    body: any,
  ): Observable<any> {
    // Create the query parameters for the URL
    const params = new HttpParams()
      .set('reportName', reportName)
      .set('exportFormat', exportFormat)
      .set('dbUrl', dbUrl)
      .set('dbUsername', dbUsername)
      .set('dbPassword', dbPassword)
      .set('subReportName',subreportName);

    const url = 'http://localhost:9090/generate-pdf/generate'; // The POST URL with query parameters

    return this.http.post(url,body,{params,responseType:'blob'})
  }
}
