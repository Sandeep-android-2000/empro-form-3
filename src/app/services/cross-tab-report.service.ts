import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrossTabReportService {

  private readonly baseUrl = 'http://localhost:9090/generate-pdf'

  constructor(private http: HttpClient){}

  generateCrossTabReport(payload: any): Observable<any> {
    const url = `${this.baseUrl}/generateReportInViewer`;
    return this.http.post(url, payload,{responseType: 'blob'});
  }
}
