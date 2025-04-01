import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ClientFeedbackComponent } from '../client-feedback/client-feedback.component';

@Component({
  selector: 'app-consultant-matches',
  standalone: true,
  templateUrl: './consultant-completed-jobs.component.html',
  styleUrls: ['./consultant-completed-jobs.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatSortModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class ConsultantCompletedJobsComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchQuery: string = '';
  dataSource: MatTableDataSource<any>;

  displayedColumns: string[] = [
    'jobid',
    'jobname',
    'client',
    'completedDate',
    'shareFeedback'
  ];

  jobs = [
    {
      jobid: 'J34232',
      jobname: 'Software Engineer',
      client: 'Google',
      completedDate: '2025-02-15',
    },
    {
      jobid: 'J64362',
      jobname: 'Data Scientist',
      client: 'Facebook',
      completedDate: '2025-02-20',
    },
    {
      jobid: 'J43212',
      jobname: 'ML Engineer',
      client: 'Amazon',
      completedDate: '2025-02-18',
    },
    {
      jobid: 'J93242',
      jobname: 'Cloud Architect',
      client: 'Microsoft',
      completedDate: '2025-02-25',
    },
    {
      jobid: 'J53221',
      jobname: 'Backend Developer',
      client: 'Netflix',
      completedDate: '2025-02-10',
    },
    {
      jobid: 'J75339',
      jobname: 'DevOps Engineer',
      client: 'Spotify',
      completedDate: '2025-02-22',
    },
  ];

  constructor(public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(this.jobs);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  onSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

 

  openFeedbackDialog(job: any) {
    const dialogRef = this.dialog.open(ClientFeedbackComponent, {
      width: '500px', // Adjust size as needed
      data: {
        jobId: job.id,
        consultantId: job.consultantId,
        consultantName: job.consultantName,
        scope: job.scope
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Feedback submitted successfully');
      }
    });
  }
}

