import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-agreement',
  templateUrl: './client-agreement.component.html',
  styleUrls: ['./client-agreement.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ClientAgreementComponent implements OnInit {
  agreementForm!: FormGroup;
  progressPercentage = 60; // Set progress for UI consistency
  currentStep = 2;
  totalSteps = 4;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.agreementForm = this.fb.group({
      preferences: [''],
      commitment: ['', Validators.required],
      otherCommitment: ['']
    });

    // Disable "Other" input unless "Other" radio is selected
    this.agreementForm.get('commitment')?.valueChanges.subscribe(value => {
      if (value !== 'other') {
        this.agreementForm.get('otherCommitment')?.reset();
        this.agreementForm.get('otherCommitment')?.disable();
      } else {
        this.agreementForm.get('otherCommitment')?.enable();
      }
    });
  }

  submitForm() {
    if (this.agreementForm.invalid) return;

    console.log("Form Submitted:", this.agreementForm.value);

    // Add submission logic here (API call, navigation, etc.)
  }

  navigateBack() {
    this.router.navigate(['/previous-page']); // Adjust route as needed
  }
}
