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
  templateUrl: './consultant-matches.component.html',
  styleUrls: ['./consultant-matches.component.css'],
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
export class ConsultantMatchesComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchQuery: string = '';
  dataSource: MatTableDataSource<any>;

  displayedColumns: string[] = [
    'jobid',
    'jobname',
    'company',
    'postedDate',
    'deadline',
    'actions'
  ];

  jobs = [
    {
      jobid: 'J34232',
      jobname: 'Software Engineer',
      company: 'Google',
      postedDate: '2025-02-20',
      deadline: '2025-03-15',
    },
    {
      jobid: 'J64362',
      jobname: 'Data Scientist',
      company: 'Facebook',
      postedDate: '2025-02-18',
      deadline: '2025-03-10',
    },
    {
      jobid: 'J43212',
      jobname: 'ML Engineer',
      company: 'Amazon',
      postedDate: '2025-02-22',
      deadline: '2025-03-18',
    },
    {
      jobid: 'J93242',
      jobname: 'Cloud Architect',
      company: 'Microsoft',
      postedDate: '2025-02-25',
      deadline: '2025-03-20',
    },
    {
      jobid: 'J53221',
      jobname: 'Backend Developer',
      company: 'Netflix',
      postedDate: '2025-02-15',
      deadline: '2025-03-12',
    },
    {
      jobid: 'J75339',
      jobname: 'DevOps Engineer',
      company: 'Spotify',
      postedDate: '2025-02-27',
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

  viewDetail(job: any) {
    console.log('Viewing details for:', job);
    // Navigate to job details page or show a modal with more info
  }

  // JavaScript: Define the updateJob function
updateJob(job: any) {
  console.log('Updating job:', job);
  // Implement the logic to navigate to an update form or open a modal
}

}
