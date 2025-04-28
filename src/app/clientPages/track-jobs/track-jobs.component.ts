import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClientJobsService, JobInProgress, ConsultantProfile } from '../../services/client-jobs.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConsultantProfileComponent } from '../consultant-profile/consultant-profile.component'; 

// Add this interface before your component class
interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-track-jobs',
  templateUrl: './track-jobs.component.html',
  styleUrls: ['./track-jobs.component.css'],
  standalone: true,
  imports: [CommonModule, MatDialogModule]
})
export class TrackJobsComponent implements OnInit {
  ongoingJobs: {
    consultantId: number;
    consultantName: string;
    jobTitle: string;
    daysSinceStart: number;
    budget: number;
    startDate: string;
  }[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientJobsService: ClientJobsService,
    private dialog: MatDialog
  ) {}


  ngOnInit() {
    const jobId = Number(this.route.snapshot.queryParamMap.get('jobId'));
    const today = new Date();
  
    this.clientJobsService.getJobsInProgress().subscribe({
      next: (response) => {
        const filteredJobs = response.jobs.filter((job: any) => job.client_job_id === jobId);
  
        const jobPromises = filteredJobs.map(async (job: any) => {
          const startDate = new Date(job.expected_start_date);
          const daysSinceStart = Math.max(
            0,
            Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
          );
  
          let consultantName = 'Consultant';
          try {
            const profile = await this.clientJobsService.getConsultantProfile(job.consultant_user_id).toPromise();
            consultantName = profile?.name ?? 'Consultant';
          } catch (error) {
            console.error(`Error fetching profile for consultant ID ${job.consultant_user_id}:`, error);
          }
  
          return {
            consultantId: job.consultant_user_id,
            consultantName,
            jobTitle: job.scope_of_service,
            daysSinceStart,   // use this
            budget: job.budget,
            startDate: startDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          };
        });
  
        // <<<< YOU MISSED THIS PART
        Promise.all(jobPromises).then(results => {
          this.ongoingJobs = results;
        });
      },
      error: (err) => {
        console.error('Error fetching ongoing jobs:', err);
      }
    });
  }
  
  openConsultantProfile(consultantId: number) {
    this.clientJobsService.getConsultantProfile(consultantId).subscribe({
      next: (consultant) => {
        this.clientJobsService.getConsultantFiles(consultantId).subscribe({
          next: (filesResponse) => {
            consultant.files_by_category = filesResponse.files_by_category || {};
            this.dialog.open(ConsultantProfileComponent, {
              width: '50vw',
              maxWidth: '700px',
              height: 'auto',
              maxHeight: '90vh',
              panelClass: 'full-screen-dialog',
              data: consultant
            });
          },
          error: (err) => {
            console.error('Error fetching consultant files:', err);
            consultant.files_by_category = {};
            this.dialog.open(ConsultantProfileComponent, {
              width: '50vw',
              maxWidth: '700px',
              height: 'auto',
              maxHeight: '90vh',
              panelClass: 'full-screen-dialog',
              data: consultant
            });
          }
        });
      },
      error: (err) => {
        console.error('Error fetching consultant profile:', err);
      }
    });
  }
  

  messageConsultant(consultantId: number, consultantName: string): void {
    // Convert consultant to chat object and navigate
    const chat = {
      id: consultantId,
      user: {
        name: consultantName,
        avatar: this.getRandomAvatar(consultantId),
      },
      lastMessage: '',
      time: this.formatTime(new Date().toISOString()),
      isOnline: false,
    };
    this.router.navigate(['/client/inbox'], { state: { chatWith: chat } });
  }

  formatTime(isoTime: string): string {
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getRandomAvatar(seed: number): string {
    return `https://randomuser.me/api/portraits/men/${seed % 100}.jpg`;
  }
}
