import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientJobsService } from '../../services/client-jobs.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ConsultantMatchesService } from '../../services/consultant-match.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


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
 
  

  constructor(
    private consultantservice: ConsultantMatchesService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProfile();

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

  toggleEditMode(): void {
    this.editMode = true;
  }

  cancelEdit(): void {
    this.profile = JSON.parse(JSON.stringify(this.originalProfile));
    this.editMode = false;
  }

  saveProfile(): void {
    const payload = {
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
    // Include written responses
    written_responses: {
      'Please state any specifics about availability that you may have':
        this.profile.written_responses?.['Please state any specifics about availability that you may have'] || '',
      'Additional Information, Comments or Clarifications':
        this.profile.written_responses?.['Additional Information, Comments or Clarifications'] || ''
    }
    };

    this.consultantservice.updateProfile(payload).subscribe({
      next: () => {
        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.editMode = false;
        this.loadProfile();
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
