import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceReportService {

  private baseUrl = 'http://localhost:9090/generate-pdf';

  constructor(private http: HttpClient) {}

  generateInvoiceReport(params: HttpParams): Observable<Blob> {
    const url = `${this.baseUrl}/generateReport`;
    return this.http.post(url, {}, { params, responseType: 'blob' });
  }
}
