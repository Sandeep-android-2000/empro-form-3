import { NgClass, NgIf } from "@angular/common";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Component } from "@angular/core";
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from "@angular/forms";
import { InvoiceReportService } from "../../services/InvoiceReport.service";
import { MulipleReportsService } from "../../services/muliple-reports.service";
import { ReportService } from "../../services/report.service";
import { ModalComponent } from "../modal/modal.component";



@Component({
  selector: 'app-report-form',
  templateUrl: './form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, ModalComponent, NgClass, NgIf]
})
export class FormComponent {

  reportForm: FormGroup;
  responseMessage: string = '';
  showModal: boolean = false;
  mess: string = "";
  isLoading: boolean = false;
  errorMessage: string = '';
  isLoadingCrossTab: boolean = false;
  isPasswordVisible = false;
  isLoadingReports: boolean = false;
  selectedReport: string = '';

  constructor(private fb: FormBuilder, private multipleReportsService: MulipleReportsService) {
    this.reportForm = this.fb.group({
      reportConfig: this.fb.group({
        exportFormat: [''],
      }),

      dataSource: this.fb.group({
        connectionDetails: this.fb.group({
          url: [''],
          username: [''],
          password: ['']
        })
      }),

      parameters: this.fb.group({

        PARAM1: [''],
        PARAM2: [''],
        PARAM3: [''],
        PARAM4: [''],
      }),

      reports: this.fb.array([
        this.fb.group({
          reportPath: ['Files/JasperTemplate/Dynamic_AWBStatus_Report.jrxml'],
        })
      ])
    });
  }
  closeModal() {
    this.showModal = false;
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  generateMultipleReports() {
    const { url: dbUrl, username: dbUsername, password: dbPassword } = this.reportForm.value.dataSource.connectionDetails;
    const exportFormat = this.reportForm.value.reportConfig.exportFormat;
    const reportName = this.selectedReport;

    const parameters = {
      PARAM1: this.reportForm.value.parameters.PARAM1,
      PARAM2: this.reportForm.value.parameters.PARAM2,
      PARAM3: this.reportForm.value.parameters.PARAM3,
      PARAM4: this.reportForm.value.parameters.PARAM4,
    };

    this.isLoadingReports = true;

    // Call the service method to generate reports
    this.multipleReportsService.generateMultipleReports(dbUrl, dbUsername, dbPassword, exportFormat, reportName, parameters).subscribe({
      next: (response: any) => {
        const contentType = response.type || response.headers?.get('Content-Type');

        if (contentType) {
          const blob = new Blob([response], { type: contentType });
          const objectUrl = window.URL.createObjectURL(blob);
          console.log('Report generated successfully:', response);
          this.mess = "Successfully Generated Report";
          this.isLoadingReports = false;
          this.showModal = true;

          if (contentType.includes('application/pdf')) {
            // Open PDF in a new tab
            // window.open(objectUrl, '_blank');
            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = 'report.pdf';  // Specify the file name
            link.click();
          } else if (contentType.includes('text/html')) {
            // Open HTML in a new tab
            // window.open(objectUrl, '_blank');
            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = 'report.html';  // Specify the file name
            link.click();
          } else if (contentType.includes('application/json')) {
            // Parse and display JSON content
            const reader = new FileReader();
            reader.onload = () => {
              console.log('JSON Response:', JSON.parse(reader.result as string));
            };
            reader.readAsText(blob);
          } else if (contentType.includes('text/xml')) {
            //Handle XML content
            // const reader = new FileReader();
            // reader.onload = () => {
            //   console.log('XML Response:', reader.result);
            // };
            // reader.readAsText(blob);

            const downloadLink = document.createElement('a');
            const objectUrl = window.URL.createObjectURL(blob);

            // Set the download link attributes
            downloadLink.href = objectUrl;
            downloadLink.download = 'report.xml'; // Name of the XML file to be downloaded

            // Append to body, trigger click to start download, then remove the link
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            // // Open the XML file in the user's default viewer (text editor, browser, etc.)
            // window.open(objectUrl, '_blank'); // Optionally open XML in browser or text editor
          } else {
            console.warn('Unhandled content type:', contentType);
            window.open(objectUrl, '_blank'); // Default fallback
          }
        } else {
          console.warn('No content type found in response');
        }

        // Reset the form after successful report generation
        //  this.resetForm();
      },
      error: (error) => {
        console.error('Error generating report:', error);
        this.mess = "Failed to Generate Report";
        this.isLoadingReports = false;
        this.showModal = true;

        // Optionally reset the form on error
        //  this.resetForm();
      }
    });

  }

  // resetForm() {
  //   this.reportForm.reset(); // Reset the form values
  //   this.selectedReport = ''; // Clear selected report if needed
  // }



}



