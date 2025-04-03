
import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { FormDataService } from '../../../services/form-data.service';

@Component({
  selector: 'app-consultant-form1',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    NavBarComponent
    
  ],
  templateUrl: './consultant-form8.component.html',
  styleUrls: ['./consultant-form8.component.css'],
})
export class ConsultantForm8Component {
  consultantForm: FormGroup;


  constructor(private fb: FormBuilder,private router: Router, private formDataService: FormDataService) {
    this.consultantForm = this.fb.group({
      jobDescription1: [''],
      jobDescription2: ['']
    });
  }

  navigateToNextForm() {
    
      console.log('Navigating to Client-Form2');
      // Save form data to the service
      this.formDataService.setFormData(this.consultantForm.value);

      this.router.navigate(['/consultant-forms-submission']);
    
  }
  
  navigateToLanding() {
    this.router.navigate(['/']);
  }

  
  navigateToPreviousForm() {
    this.router.navigate(['/consultant-form3']);
  }
  onSubmit() {
    
      this.router.navigate(['/consultant-forms-submission']);
      

  }
}
