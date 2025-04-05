
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
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-consultant-forms-submission',
  standalone: true,
  imports: [RouterModule,HttpClientModule],
  templateUrl: './consultant-forms-submission.component.html',
  styleUrl: './consultant-forms-submission.component.css'
})

export class ConsultantFormsSubmissionComponent {
  finalPayload: any = {};
  constructor(private router: Router, private formDataService: FormDataService, private http: HttpClient) {
    this.finalPayload = this.formDataService.getFormData();
    this.finalPayload= {
      name : this.finalPayload.name || " ", // Fallback to default if undefined, for demo purposes
      email : this.finalPayload.email  ,
      password : this.finalPayload.password , // Fallback to default if undefined, for demo purposes
      confirm_password : this.finalPayload.confirmPassword ,
      job_title : this.finalPayload.jobTitle || "Environmental Consultant", // Fallback to default if undefined, for demo purposes
      company_name : this.finalPayload.companyName || "Doe Environmental Solutions",
      company_address : this.finalPayload.companyAddress || "123 Green Street, New York, NY",
      phone_number : this.finalPayload.phoneNumber || "+1 234-567-8901",
      environmental_services : [
          "Environmental Compliance Audits",
          "Hazardous Waste Management",
          "ISO 14001 Auditing"
      ],
      property_transactions : [
          "Phase I / II Site Assessment (ASTM, AAI)",
          "Liability Quantification / Cost Modeling"
      ],
      field_activities : [
          "Soil and Groundwater Sampling",
          "Contamination Delineation"
      ],
      hazardous_materials : [
          "Asbestos",
          "Lead"
      ],
      safety_facility_compliance : [
          "OSHA Compliance Programs",
          "Water Management Plans - Lead, Legionella"
      ],
      industrial_hygiene : [
          "Indoor Air Quality",
          "Noise Assessments / Controls"
      ],
      construction_safety : [
          "Company / Site-Specific Health & Safety Plans"
      ],
      written_responses : {
          "Please state any specifics about availability that you may have": "I have 10+ years of experience in environmental audits.",
          "Additional Information, Comments or Clarifications": "Certified in ISO 14001 and OSHA safety standards."
      }
  }
    console.log('Final Payload before submission:', this.finalPayload);
    
  }
 
  navigateToLanding() {
    this.router.navigate(['/']);
  }


  onGetStarted() {
    console.log("Button Clicked!");
    // Navigate to another page if needed
    
    console.log('Final JSON Payload:', this.finalPayload);

    this.http.post(`${environment.apiUrl}/consultant/signup`, this.finalPayload,{ withCredentials: true })
      .subscribe(response => {
        console.log('Form submitted successfully', response);
        this.formDataService.setFormData({}); // Clear after submission
      }, error => {
        console.error('Error submitting form', error);
      });
     this.router.navigate(['/login']);
  }

}
