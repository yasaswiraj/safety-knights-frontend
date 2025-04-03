import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientJobsService } from '../../services/client-jobs.service';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css']
})
export class ClientProfileComponent implements OnInit {
  profile: any = null;

  constructor(private clientJobsService: ClientJobsService) {}

  ngOnInit(): void {
    this.clientJobsService.getClientProfile().subscribe({
      next: (data) => {
        this.profile = data;
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
      }
    });
  }
}
