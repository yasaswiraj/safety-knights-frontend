import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-consultant-form-contact',
  imports: [ ReactiveFormsModule,RouterModule], 
  templateUrl: './consultant-form-contact.component.html',
  styleUrls: ['./consultant-form-contact.component.css']
})
export class ConsultantFormContactComponent {
  
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder,private router: Router) {
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      jobTitle: ['', Validators.required],
      companyName: ['', Validators.required],
      companyAddress: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }

// ✅ Navigate to Client-Form1
navigateToPreviousForm() {
  this.router.navigate(['/consultant-form1']);
}
navigateToNextForm() {
    
  this.router.navigate(['/consultant-form3']);

}
// ✅ Navigate to Landing Page
navigateToLanding() {
  this.router.navigate(['/']);
}

// ✅ Navigate to Client-Dashboard
navigateToDashboard() {
  this.router.navigate(['/consultant-form2']);
}


  onSubmit() {
    if (this.signUpForm.valid) {
      console.log('Form Submitted', this.signUpForm.value);
      // Navigate to the next form
      this.router.navigate(['/consultant-form2']);
    } else {
      console.log('Form is invalid');
    }
  }
}
