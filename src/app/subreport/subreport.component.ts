import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-subreport',
  imports: [ReactiveFormsModule,NgClass],
  templateUrl: './subreport.component.html',
  styleUrl: './subreport.component.css'
})
export class SubreportComponent {

  generateReportForm: FormGroup;
  isLoading = false;
  errorMessage = '';


  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.generateReportForm = this.fb.group({
      partyId: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')]],
    });
  }

  get partyId() {
    return this.generateReportForm.get('partyId');
  }

  generatePDF() {
    if (this.generateReportForm.invalid) {
      return;
    }

    const partyId = this.partyId?.value;
    const url = `http://localhost:9090/generate-pdf/subreport?Party_Id=${partyId}`;
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Report_${partyId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error generating PDF:', error);
        this.errorMessage = 'Failed to generate the PDF. Please try again.';
        this.isLoading = false;
      },
    });
  }

}
