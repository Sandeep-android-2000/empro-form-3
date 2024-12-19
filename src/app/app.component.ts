import { Component } from '@angular/core';
import { FormComponent } from "./form/form.component";
import { SubreportComponent } from "./subreport/subreport.component";


@Component({
  selector: 'app-root',
  imports: [FormComponent, SubreportComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'forms-empro';
}
