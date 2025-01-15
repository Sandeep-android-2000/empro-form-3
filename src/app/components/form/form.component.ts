import { NgClass, NgFor, NgIf } from "@angular/common";

import { Component } from "@angular/core";
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, FormArray } from "@angular/forms";

import { MulipleReportsService } from "../../services/muliple-reports.service";

import { ModalComponent } from "../modal/modal.component";



@Component({
  selector: 'app-report-form',
  templateUrl: './form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, ModalComponent, NgClass, NgIf,NgFor]
})
export class FormComponent {

  reportForm: FormGroup;
  showModal: boolean = false;
  mess: string = "";
  isPasswordVisible = false;
  isLoadingReports: boolean = false;
  selectedReport: string = '';
  userResponse: string='';

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

      parameters: this.fb.array([]), // Changed to FormArray
      subReportName: [''], // Add this line
      reports: this.fb.array([
        this.fb.group({
          reportPath: ['Files/JasperTemplate/Dynamic_AWBStatus_Report.jrxml'],
        })
      ])
    });
  }

  get parameters(): FormArray {
    return this.reportForm.get('parameters') as FormArray;
  }

  addParameter(): void {
    this.parameters.push(this.fb.control(''));
  }

  removeParameter(index: number): void {
    if (this.parameters.length >= 1) {
      this.parameters.removeAt(index);
    }
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
    const subReportName = this.reportForm.value.subReportName
    const reportName = this.selectedReport;
     


    const parameters = this.parameters.value.reduce((acc: any, param: string, index: number) => {
      acc[`PARAM${index + 1}`] = param;
      return acc;
    }, {});

    
    const requestBody = {

      parameters:{
        ...parameters,

      }, 
      userResponse: this.userResponse, // This will be dynamically updated after the popup
    };
    
    
    this.isLoadingReports = true;

    // Call the service method to generate reports
    this.multipleReportsService.generateMultipleReports(dbUrl, dbUsername, dbPassword, exportFormat, reportName,subReportName, requestBody).subscribe({
      next: (response: any) => {

          const contentType = response.type;
          //response.body.type
          console.log(response)
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
              window.open(objectUrl, '_blank');
              // const link = document.createElement('a');
              // link.href = objectUrl;
              // link.download = 'report.html';  // Specify the file name
              // link.click();
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
            } else if (contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
              // Handle Excel (.xlsx) format
              const link = document.createElement('a');
              link.href = objectUrl;
              link.download = 'report.xlsx'; // Specify the file name
              link.click();
            } else {
              console.warn('Unhandled content type:', contentType);
              window.open(objectUrl, '_blank'); // Default fallback
            }
          } else {
            console.warn('No content type found in response');
          }
        
      },
      error: (error) => {
        // console.log("Error",error)
        console.error(error);

        this.isLoadingReports = false;

        // Map specific errors to user-friendly messages
        const errorCode = error.status;
        let errorMessage = 'Failed to generate Report!';

        switch (errorCode) {
          case 400:
            errorMessage = 'Bad Request';
            break;
          case 401:
            errorMessage = 'Invalid Credentials';
            break;
          case 404:
            errorMessage = 'Not Found';
            break;
          case 500:
            errorMessage = 'Internal server error ! Please retry again';
            break;
        }

        this.mess = errorMessage;
        this.showModal = true;
      }
    });

  }

  resetFormParameters() {
    // this.reportForm.reset(); // Reset the form values
    // this.selectedReport = ''; // Clear selected report if needed
    this.reportForm.get("parameters")?.reset();
    // this.selectedReport = ''; 
  }

  onReportChange(newReport: string) {
    this.selectedReport = newReport;
    this.resetFormParameters(); // Reset form fields when report type changes
  }

  handleModalResponse(response: string): void {
    this.userResponse = response; // Update the userResponse field with 'yes' or 'no'
    console.log('User Response:', this.userResponse);
    this.showModal = false; // Close the modal
  }



}



