
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
@Component({
  selector: 'app-consultant-forms-submission',
  imports: [RouterModule],
  templateUrl: './consultant-forms-submission.component.html',
  styleUrl: './consultant-forms-submission.component.css'
})

export class ConsultantFormsSubmissionComponent {
  constructor(private router: Router) {}
 
  navigateToLanding() {
    this.router.navigate(['/']);
  }


  onGetStarted() {
    console.log("Button Clicked!");
    // Navigate to another page if needed
     this.router.navigate(['/consultant-dashboard']);
  }

}
