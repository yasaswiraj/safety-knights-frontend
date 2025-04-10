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
  progressPercentage = 60;
  currentStep = 2;
  totalSteps = 4;

  jobId!: number;
  consultantId!: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private clientJobsService: ClientJobsService
  ) {}

  ngOnInit() {
    this.jobId = Number(this.route.snapshot.queryParamMap.get('jobId'));
    this.consultantId = Number(this.route.snapshot.queryParamMap.get('consultantId'));

    this.agreementForm = this.fb.group({
      commitment: ['', Validators.required],
      noCommitmentReason: [{ value: '', disabled: true }] // Initially disabled
    });

    // Watch for changes to commitment
    this.agreementForm.get('commitment')?.valueChanges.subscribe(value => {
      const reasonControl = this.agreementForm.get('noCommitmentReason');

      if (value === 'no') {
        reasonControl?.enable();
        reasonControl?.setValidators([Validators.required]);
      } else {
        reasonControl?.reset();
        reasonControl?.disable();
        reasonControl?.clearValidators();
      }

      reasonControl?.updateValueAndValidity();
    });
  }

  submitForm() {
    if (this.agreementForm.invalid) return;
  
    const formValue = this.agreementForm.getRawValue();
  
    const payload = {
      commitment: formValue.commitment,
      no_commitment_reason: formValue.noCommitmentReason || null
    };

    console.log('Form submitted:', payload);
  
    this.clientJobsService.acceptBid(this.jobId, this.consultantId, payload).subscribe({
      next: () => {
        this.router.navigate(['/client/job-in-progress']);
      },
      error: (err) => {
        console.error('Error accepting bid:', err);
      }
    });
  }
  

  navigateBack() {
    this.router.navigate(['client/received-bids']);
  }
}
