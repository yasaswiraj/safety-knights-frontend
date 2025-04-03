
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NavBarComponent } from "../../../components/nav-bar/nav-bar.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormDataService } from '../../../services/form-data.service';
@Component({
  selector: 'app-consultant-forms-submission',
  standalone: true,
  imports: [RouterModule, NavBarComponent,NavBarComponent,HttpClientModule],
  templateUrl: './consultant-forms-submission.component.html',
  styleUrl: './consultant-forms-submission.component.css'
})

export class ConsultantFormsSubmissionComponent {
  finalPayload: any = {};
  constructor(private router: Router, private formDataService: FormDataService, private http: HttpClient) {
    this.finalPayload = this.formDataService.getFormData();
  }
 
  navigateToLanding() {
    this.router.navigate(['/']);
  }


  onGetStarted() {
    console.log("Button Clicked!");
    // Navigate to another page if needed
    
    console.log('Final JSON Payload:', this.finalPayload);

    this.http.post('', this.finalPayload,{ withCredentials: true })
      .subscribe(response => {
        console.log('Form submitted successfully', response);
        this.formDataService.setFormData({}); // Clear after submission
      }, error => {
        console.error('Error submitting form', error);
      });
     this.router.navigate(['/login']);
  }

}
