import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private apiUrl = 'http://localhost:9090/generate-pdf/generateMultipleReports'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  generateReports(payload: any): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<string>(this.apiUrl, payload, { headers });
  }
}
