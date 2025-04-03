
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
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { FormDataService } from '../../../services/form-data-service'; // Import the FormDataService

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
  consultantForm = new FormGroup({
    // email: new FormControl('', [Validators.required, Validators.email]),
    // password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    // confirmPassword: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private formDataService: FormDataService) {}

  navigateToNextForm() {
    
      console.log('Navigating to Client-Form2');
      // Save form data to the service
      this.formDataService.setFormData(5, this.consultantForm.value);

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
