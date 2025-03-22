import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-consultant-matches',
  standalone: true,
  templateUrl: './consultant-active-jobs.component.html',
  styleUrls: ['./consultant-active-jobs.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSortModule,
    FormsModule,
  ],
})
export class ConsultantActiveJobsComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchQuery: string = '';
  dataSource: MatTableDataSource<any>;

  displayedColumns: string[] = [
    'jobid',
    'jobname',
    'client',
    'status',
    'deadline',
    'actions'
  ];

  jobs = [
    {
      jobid: 'J34232',
      jobname: 'Software Engineer',
      client: 'Google',
      status: 'Active',
      deadline: '2025-03-15',
    },
    {
      jobid: 'J64362',
      jobname: 'Data Scientist',
      client: 'Facebook',
      status: 'Pending',
      deadline: '2025-03-10',
    },
    {
      jobid: 'J43212',
      jobname: 'ML Engineer',
      client: 'Amazon',
      status: 'Active',
      deadline: '2025-03-18',
    },
    {
      jobid: 'J93242',
      jobname: 'Cloud Architect',
      client: 'Microsoft',
      status: 'Closed',
      deadline: '2025-03-20',
    },
    {
      jobid: 'J53221',
      jobname: 'Backend Developer',
      client: 'Netflix',
      status: 'Active',
      deadline: '2025-03-12',
    },
    {
      jobid: 'J75339',
      jobname: 'DevOps Engineer',
      client: 'Spotify',
      status: 'Pending',
      deadline: '2025-03-25',
    },
  ];

  constructor() {
    this.dataSource = new MatTableDataSource(this.jobs);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  onSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewUpdate(job: any) {
    console.log('Updating job:', job);
    // Navigate to update form or show a modal for job editing
  }
}
