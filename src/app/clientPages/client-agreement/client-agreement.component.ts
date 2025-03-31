import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientJobsService } from '../../services/client-jobs.service';

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
    ReactiveFormsModule,
  ]
})
export class ClientAgreementComponent implements OnInit {
  agreementForm!: FormGroup;
  progressPercentage = 60; // Set progress for UI consistency
  currentStep = 2;
  totalSteps = 4;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private clientJobsService: ClientJobsService
  ) { }

  jobId!: number;
  consultantId!: number;

  ngOnInit() {
    this.jobId = Number(this.route.snapshot.queryParamMap.get('jobId'));
    this.consultantId = Number(this.route.snapshot.queryParamMap.get('consultantId'));
  
    this.agreementForm = this.fb.group({
      preferences: [''],
      commitment: ['', Validators.required],
      otherCommitment: ['']
    });
  
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
  
    this.clientJobsService.acceptBid(this.jobId, this.consultantId).subscribe({
      next: () => {
        console.log("Bid accepted, job marked as in_progress");
        this.router.navigate(['client/pending-bids']);
      },
      error: (err) => {
        console.error("Error accepting bid:", err);
      }
    });
  }
  

  navigateBack() {
    this.router.navigate(['client/received-bids']);
  }
}
