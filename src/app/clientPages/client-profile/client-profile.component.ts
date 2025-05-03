import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientJobsService } from '../../services/client-jobs.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css']
})
export class ClientProfileComponent implements OnInit {
  profile: any = null;
  originalProfile: any = null;
  editMode = false;
  reviews: any[] = [];
  newEmail: string = '';
  currentPassword: string = '';
  isEditingEmail = false;




  constructor(
    private clientJobsService: ClientJobsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadReviews();

    // Check route data for editMode flag
    const isEditRoute = this.route.snapshot.data['editMode'];
    if (isEditRoute) {
      this.editMode = true;
      
    }
  }

  loadProfile(): void {
    this.clientJobsService.getClientProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.originalProfile = JSON.parse(JSON.stringify(data));
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
      }
    });
  }

  loadReviews(): void {
    this.clientJobsService.getFeedbackReceived().subscribe({
      next: (data) => {
        this.reviews = data.feedbacks || [];
      },
      error: (err) => {
        console.error('Failed to load received feedbacks:', err);
      }
    });
  }
  
  
  
  toggleEditMode(): void {
    this.editMode = true;
  }

  cancelEdit(): void {
    this.profile = JSON.parse(JSON.stringify(this.originalProfile));
    this.editMode = false;
    this.isEditingEmail = false;
    this.newEmail = '';
    this.currentPassword = '';
  }
  
  saveProfile(): void {
    const profilePayload = {
      name: this.profile.name,
      job_title: this.profile.job_title,
      company_name: this.profile.company_name,
      company_address: this.profile.company_address,
      phone_number: this.profile.contact
    };
  
    const updateMainProfile = () => {
      this.clientJobsService.updateClientProfile(profilePayload).subscribe({
        next: () => {
          alert('Profile updated successfully!');
          this.editMode = false;
          this.isEditingEmail = false;
          this.loadProfile();
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          alert('Failed to update profile.');
        }
      });
    };
  
    // Update email first if user changed it
    if (this.isEditingEmail && this.newEmail !== this.profile.email) {
      if (!this.currentPassword) {
        alert("Please enter your current password to change email.");
        return;
      }
      this.clientJobsService.updateEmail(this.newEmail, this.currentPassword).subscribe({
        next: (res) => {
          if (res?.access_token) {
            localStorage.setItem('access_token', res.access_token);
          }
          alert('Email updated successfully!');
          this.profile.email = this.newEmail;  // update UI immediately
          updateMainProfile();
        },
        error: (err) => {
          console.error('Failed to update email:', err);
          alert(err?.error?.detail || 'Failed to update email.');
        }
      });
    } else {
      updateMainProfile();
    }
  }
  
  
}
