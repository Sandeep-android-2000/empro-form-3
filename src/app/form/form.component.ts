import { ModalComponent } from './../modal/modal.component';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReportService } from '../report.service';


@Component({
  selector: 'app-report-form',
  templateUrl: './form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, ModalComponent]
})
export class FormComponent {
  reportForm: FormGroup;
  responseMessage: string = '';
  showModal: boolean = false;
  mess: string = "";
  constructor(private fb: FormBuilder, private reportService: ReportService) {
    this.reportForm = this.fb.group({
      reportConfig: this.fb.group({
        exportFormat: ['pdf'],
        outputPath: ['C:/generated-reports/'],
        locale: ['en_US'],
        timeZone: ['UTC']
      }),
      dataSource: this.fb.group({
        connectionDetails: this.fb.group({
          url: [''],
          username: ['sa'],
          password: ['Microsoft@1234']
        })
      }),

      parameters: this.fb.group({
        Param1: ['',Validators.requiredTrue],
        Param2: ['',Validators.requiredTrue],
        Param3: ['',Validators.requiredTrue],
        reportTitle: ['',Validators.requiredTrue]
      }),

      reports: this.fb.array([
        this.fb.group({
          reportPath: ['Files/JasperTemplate/Dynamic_AWBStatus_Report.jrxml',Validators.requiredTrue],

        })
      ])
    });
  }

  onSubmit() {

    console.log('backend')
     
      this.reportService.generateReports(this.reportForm.value).subscribe({
        next: response => {
          this.responseMessage = `Success: ${response}`;
          this.showModal = true;
          this.mess = "Successfully Generated Report";
        },
        error: error => {
          this.showModal = true;
          this.mess = "Failed to Generate Report";
          console.error('Error Response:', error);
          this.responseMessage = `Error: ${error.error?.message || 'An unexpected error occurred.'}`;
        },
      });
    
  }

  closeModal() {
    this.showModal = false;
  }
}
