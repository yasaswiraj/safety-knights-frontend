import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClientJobsService, JobInProgress, ConsultantProfile } from '../../services/client-jobs.service';
import { ActivatedRoute } from '@angular/router';

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
  imports: [CommonModule]
})
export class TrackJobsComponent implements OnInit {
  ongoingJobs: {
    consultantId: number;
    consultantName: string;
    jobTitle: string;
    daysLeft: number;
    budget: number;
    startDate: string;
  }[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientJobsService: ClientJobsService
  ) {}
ngOnInit() {
    const jobId = Number(this.route.snapshot.queryParamMap.get('jobId'));
    const today = new Date();

    this.clientJobsService.getJobsInProgress().subscribe({
      next: (response) => {
        const filteredJobs = response.jobs.filter((job: any) => job.client_job_id === jobId);

        const jobPromises = filteredJobs.map(async (job: any) => {
          const startDate = new Date(job.expected_start_date);
          const daysLeft = Math.max(
            0,
            Math.ceil((new Date(job.proposal_deadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
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
            daysLeft,
            budget: job.budget,
            startDate: startDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          };
        });

        Promise.all(jobPromises).then(results => {
          this.ongoingJobs = results;
        });
      },
      error: (err) => {
        console.error('Error fetching ongoing jobs:', err);
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
