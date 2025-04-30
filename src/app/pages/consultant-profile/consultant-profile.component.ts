import { Component, OnInit } from '@angular/core';
import { ConsultantMatchesService } from '../../services/consultant-match.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ProfileResponse {
  form_structure: {
    [key: string]: {
      type: string;
      option?: string[];
    };
  };
  response: {
    name: string;
    email: string;
    job_title: string;
    company_name: string;
    company_address: string;
    phone_number: string;
    environmental_services: string[];
    property_transactions: string[];
    field_activities: string[];
    hazardous_materials: string[];
    safety_facility_compliance: string[];
    industrial_hygiene: string[];
    construction_safety: string[];
    written_responses: {
      [key: string]: string;
    };
    file_locations: any[];
  };
}

@Component({
  selector: 'app-consultant-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultant-profile.component.html',
  styleUrl: './consultant-profile.component.css'
})
export class ConsultantProfileComponent implements OnInit {
  profileData: ProfileResponse | null = null;
  isEditing: boolean = false;
  loading: boolean = true;
  error: string | null = null;

  constructor(private consultantService: ConsultantMatchesService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.consultantService.getProfile().subscribe({
      next: (data) => {
        this.profileData = data;
        this.loading = false;
        console.log('Profile data loaded:', this.profileData);
      },
      error: (err) => {
        this.error = 'Failed to load profile. Please try again later.';
        this.loading = false;
        console.error('Error loading profile:', err);
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveProfile(): void {
    if (!this.profileData) return;
    
    this.loading = true;
    this.consultantService.updateProfile(this.profileData.response).subscribe({
      next: () => {
        this.isEditing = false;
        this.loading = false;
        this.error = null;
      },
      error: (err) => {
        this.error = 'Failed to update profile. Please try again later.';
        this.loading = false;
        console.error('Error updating profile:', err);
      }
    });
  }

  getCategoryKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  formatCategoryName(name: string): string {
    return name.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }

  hasWrittenResponses(): boolean {
    return this.profileData?.response?.written_responses 
      ? Object.keys(this.profileData.response.written_responses).length > 0 
      : false;
  }
}
