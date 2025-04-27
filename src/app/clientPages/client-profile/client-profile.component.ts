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
    this.clientJobsService.getClientReviews().subscribe({
      next: (data) => {
        this.reviews = data.reviews || [];
      },
      error: (err) => {
        console.error('Failed to load reviews:', err);
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
      phone_number: this.profile.contact
    };

    this.clientJobsService.updateClientProfile(payload).subscribe({
      next: () => {
        alert('Profile updated successfully!');
        this.editMode = false;
        this.loadProfile();
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        alert('Failed to update profile.');
      }
    });
  }
}
