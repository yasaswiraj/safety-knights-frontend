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
import { LoadingComponent } from '../../components/loading/loading.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';



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
    LoadingComponent
],
})
export class PendingBidsComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchTerm = '';
  isLoading = false;


  dataSource: MatTableDataSource<PendingBid> = new MatTableDataSource<PendingBid>([]);
  displayedColumns: string[] = ['jobName', 'deadline', 'budget', 'actions', 'delete'];

  constructor(private router: Router, private clientJobsService: ClientJobsService, private formDataService: FormDataService,  public dialog: MatDialog ) { }

  ngOnInit() {
    this.fetchPendingBids();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchPendingBids() {
    this.isLoading = true; // Start loading
    this.clientJobsService.getPendingBids().subscribe({
      next: (response) => {
        if (!response || response.jobs.length === 0) {
          console.warn('No jobs returned. Possible missing cookie/session?');
        }
        const transformedJobs = response.jobs.map(job => ({
          ...job,
          jobId: job.client_job_id,
          formId: job.form_id,
          jobName: job.scope_of_service,
          deadline: job.proposal_deadline,
          budget: job.budget,
        }));
        this.dataSource.data = transformedJobs;
        this.isLoading = false; // Stop loading
      },
      error: (err) => {
        console.error('Error from API:', err);
        this.isLoading = false; // Stop loading even on error
      }
    });
  }
  
  confirmDelete(bid: PendingBid) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px', // Control the width of the dialog
      data: { jobName: bid.scope_of_service } // Pass the job name to the dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteJob(bid.client_job_id);
      }
    });
  }
  

  deleteJob(jobId: number) {
    this.clientJobsService.deleteJob(jobId).subscribe({
      next: (res) => {
        console.log(`Deleted job ${jobId}:`, res);
        this.fetchPendingBids(); // Refresh the table
      },
      error: (err) => {
        console.error('Failed to delete job:', err);
        alert('Failed to delete job. Please try again.');
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
      console.log('[EDIT JOB] Getting filled form for jobId:', res);

      const jd = res?.filled_form?.job_details;

      if (!jd) return;
      

      const responses = jd.responses || [];

      // Map question -> response_value
      const responseMap: Record<string, string> = {};
      for (const entry of responses) {
        responseMap[entry.question] = entry.response_value;
      }

      const insuranceRaw = responseMap['Insurance Requirements for the Contractor'] || '';
      const insuranceList = insuranceRaw ? insuranceRaw.split(', ').map(x => x.trim()) : [];
      insuranceCoverageDetails: jd.insurance_coverage_details || {}



      const formData = {
        scopeOfService: jd.scope_of_service?.split(', ') || [],
        jobDescription: jd.work_in_detail,
        location: jd.project_location,
        deadline: jd.proposal_deadline,
        projectStartDate: jd.expected_start_date,
        budget: jd.budget,
        selectedInsurances: insuranceList,
        payment_terms: responseMap['Payment Terms'] || '',
        payment_method: responseMap['Preferred Method of Payment to Contractor'] || '',
        contractor_preferences: responseMap['Do you have any preferences regarding which contractors should not be considered?'] || '',
        commitment_to_proceed: responseMap['If the proposal is within budget, would you commit to moving forward?'] || '',
      };

      console.log('[EDIT JOB] Extracted responses map:', responseMap);
      console.log('[EDIT JOB] Extracted insurances:', insuranceList);

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
    const jobId = bid.client_job_id;
    const formId = bid.form_id;
    const userId = bid.client_user_id; 
  
    if (!jobId || !formId || !userId) {
      console.error('Missing jobId, formId or userId');
      return;
    }
    console.log('Navigating to update-job with:', bid.client_user_id, bid.client_job_id);

    this.router.navigate(['/client/update-job'], {
      state: {
        client_response_id: jobId,
        user_id: userId
      }
    });
  }
  
  

}
