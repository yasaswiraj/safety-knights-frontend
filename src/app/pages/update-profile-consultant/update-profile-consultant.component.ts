import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientJobsService } from '../../services/client-jobs.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ConsultantMatchesService } from '../../services/consultant-match.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-consultant-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MatSnackBarModule],
  templateUrl: './update-profile-consultant.component.html',
  styleUrls: ['./update-profile-consultant.component.css']
})
export class UpdateProfileConsultantComponent implements OnInit {
  profile: any = null;
  originalProfile: any = null;
  editMode = false;

  serviceCategories: string[] = [
    'environmental_services',
    'property_transactions',
    'field_activities',
    'hazardous_materials',
    'safety_facility_compliance',
    'industrial_hygiene',
    'construction_safety'
  ];

  total_jobs: number = 0; 
  completed_jobs: number = 0;
  active_jobs: number = 0;
  

  constructor(
    private consultantservice: ConsultantMatchesService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.fetchTotalJobs(); 
    // Check route data for editMode flag
    const isEditRoute = this.route.snapshot.data['editMode'];
    if (isEditRoute) {
      this.editMode = true;
    }
  }

  loadProfile(): void {
    this.consultantservice.getProfile().subscribe({
      next: (data) => {
        this.profile = data.response;
        this.originalProfile = JSON.parse(JSON.stringify(data.response));
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
      }
    });
  }

  fetchTotalJobs(): void {
    forkJoin({
      api1: this.consultantservice.getJobsFromAPI1(),
      api2: this.consultantservice.getJobsFromAPI2(),
      api3: this.consultantservice.getJobsFromAPI3()
    }).subscribe({
      next: ({ api1, api2, api3 }) => {
        // Debug logs
        console.log('API 1 jobs:', api1);
        console.log('API 2 jobs:', api2);
        console.log('API 3 jobs:', api3);
  
        // Extract and count jobs
        const api1Jobs = api1?.pending_bids || [];
        const api2Jobs = api2?.jobs_in_progress || [];
        const api3Jobs = api3?.completed_jobs || [];
  
         this.total_jobs = api1Jobs.length + api2Jobs.length + api3Jobs.length;
         this.active_jobs = api2Jobs.length; // Assuming active jobs are from API 2
        this.completed_jobs = api3Jobs.length; // Assuming completed jobs are from API 3
  
        console.log('Total jobs from all APIs:', this.total_jobs);
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
      }
    });
  }

  toggleEditMode(): void {
    this.editMode = true;
  }

  cancelEdit(): void {
    this.profile = JSON.parse(JSON.stringify(this.originalProfile));
    this.editMode = false;
  }

  saveProfile(): void {
    const consultant_data_str = {
      name: this.profile.name,
      job_title: this.profile.job_title,
      company_name: this.profile.company_name,
      company_address: this.profile.company_address,
      phone_number: this.profile.phone_number,
      environmental_services: this.profile.environmental_services,
    property_transactions: this.profile.property_transactions,
    field_activities: this.profile.field_activities,
    hazardous_materials: this.profile.hazardous_materials,
    safety_facility_compliance: this.profile.safety_facility_compliance,
    industrial_hygiene: this.profile.industrial_hygiene,
    construction_safety: this.profile.construction_safety,
    environmental_services_expertise  : this.profile.environmental_services_expertise,
     health_safety_expertise : this.profile.health_safety_expertise,
    // Include written responses
    written_responses: {
      'Please state any specifics about availability that you may have':
        this.profile.written_responses?.['Please state any specifics about availability that you may have'] || '',
      'Additional Information, Comments or Clarifications':
        this.profile.written_responses?.['Additional Information, Comments or Clarifications'] || ''
    }
    };

    // 🧃 Create FormData instead of plain object
  const formData = new FormData();
  formData.append('consultant_data_str', JSON.stringify(consultant_data_str));

    this.consultantservice.updateProfile(formData).subscribe({
      next: () => {
        const snackBarRef = this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 1000,
          panelClass: ['snackbar-success'],
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        // this.editMode = false;
        // this.loadProfile();
        snackBarRef.onAction().subscribe(() => {
          snackBarRef.dismiss();
        });

        setTimeout(() => {
          this.editMode = false;
          this.loadProfile();
        }, 100);
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.snackBar.open('Failed to update profile.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}
