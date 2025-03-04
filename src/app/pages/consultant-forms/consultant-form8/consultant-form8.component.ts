
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

@Component({
  selector: 'app-consultant-form1',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
    
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

  constructor(private router: Router) {}

  navigateToNextForm() {
    
      console.log('Navigating to Client-Form2');
      this.router.navigate(['/consultant-forms-submission']);
    
  }
  
  navigateToLanding() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    
      this.router.navigate(['/consultant-forms-submission']);
      

  }
}
