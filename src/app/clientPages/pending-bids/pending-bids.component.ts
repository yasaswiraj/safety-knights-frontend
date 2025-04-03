import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClientJobsService, PendingBid } from '../../services/client-jobs.service';
import { FormDataService } from '../../services/form-data.service';


@Component({
  selector: 'app-pending-bids',
  standalone: true,
  templateUrl: './pending-bids.component.html',
  styleUrls: ['./pending-bids.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
  ],
})
export class PendingBidsComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchTerm = '';

  dataSource: MatTableDataSource<PendingBid> = new MatTableDataSource<PendingBid>([]);  
  displayedColumns: string[] = ['jobName', 'deadline', 'budget', 'actions'];

  constructor(private router: Router, private clientJobsService: ClientJobsService, private formDataService: FormDataService) { }

  ngOnInit() {
    this.fetchPendingBids();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchPendingBids() {
    console.log('Calling API...');
    // const userId = localStorage.getItem('user_id');
    // console.log('User ID:', userId);
    this.clientJobsService.getPendingBids().subscribe({
      next: (response) => {
        console.log('Response:', response);
        if (!response || response.jobs.length === 0) {
          console.warn('No jobs returned. Possible missing cookie/session?');
        }
        const transformedJobs = response.jobs.map(job => ({
          ...job,
          jobId: job.client_job_id,
          jobName: job.scope_of_service,
          deadline: job.proposal_deadline,
          budget: job.budget,
        }));
  
        this.dataSource.data = transformedJobs;
      },
      error: (err) => {
        console.error('Error from API:', err);
      }
    });
  }



  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    this.dataSource.filter = term;
  }

  editJob(job: PendingBid) {
    const formattedDeadline = this.formatDateToYYYYMMDD(job.proposal_deadline);
    const formattedStartDate = this.formatDateToYYYYMMDD(job.expected_start_date);
  
    this.clientJobsService.getFilledForm(job.client_job_id).subscribe((res) => {
      console.log('[EDIT JOB] Getting filled form for jobId:', job);

      const jd = res?.filled_form?.job_details;
    
      if (!jd) return;
    
      const responses = jd.responses || [];
    
      // Map question -> response_value
      const responseMap: Record<string, string> = {};
      for (const entry of responses) {
        responseMap[entry.question] = entry.response_value;
      }
    
      const formData = {
        scopeOfService: jd.scope_of_service?.split(', ') || [],
        jobDescription: jd.work_in_detail,
        location: jd.project_location,
        deadline: jd.proposal_deadline,
        projectStartDate: jd.expected_start_date,
        budget: jd.budget,
        selectedInsurances: [], // You could also extract this from responseMap if it's stored
        payment_terms: responseMap['Payment Terms'] || '',
        payment_method: responseMap['Preferred Method of Payment to Contractor'] || '',
        contractor_preferences: responseMap['Do you have any preferences regarding which contractors should not be considered?'] || '',
        commitment_to_proceed: responseMap['If the proposal is within budget, would you commit to moving forward?'] || '',
      };
    
      this.formDataService.setFormData(formData, jd.client_job_id);
      this.router.navigate(['/client/client-form']);
    });
    
  }
  
  
  
  

  
  formatDateToYYYYMMDD(dateInput: string | Date): string | null {
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return null;
  
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
  
      return `${year}-${month}-${day}`;
    } catch (err) {
      console.error('Invalid date format:', dateInput);
      return null;
    }
  }
  
  
  

  handleAction(bid: PendingBid) {
    this.editJob(bid);
  }
  
}
