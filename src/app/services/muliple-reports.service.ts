import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
 
 
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
    parameters: Record<string, string>
  ): Observable<any> {
    // Create the query parameters for the URL
    const params = new HttpParams()
      .set('reportName', reportName)
      .set('exportFormat', exportFormat)
      .set('dbUrl', dbUrl)
      .set('dbUsername', dbUsername)
      .set('dbPassword', dbPassword);
 
    const url = 'http://172.29.57.36:9090/generate-pdf/generate'; // The POST URL with query parameters
 
    return this.http.post(url, parameters, { params, responseType: 'blob' });
  }
}
 
 