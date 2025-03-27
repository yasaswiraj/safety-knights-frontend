import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateJobRequest {
  scope_of_service: string;
  work_in_detail: string;
  project_location: string;
  proposal_deadline: string;
  expected_start_date: string;
  budget: number;
  insurance_requirements?: string;
  payment_terms?: string;
  payment_method?: string;
  contractor_preferences?: string;
  commitment_to_proceed?: string;
}

export interface PendingBid {
  client_job_id: number;
  // client_user_id: number;
  form_id: number;
  scope_of_service: string;
  work_in_detail: string;
  project_location: string;
  proposal_deadline: string;
  expected_start_date: string;
  budget: number;
  job_status: string;
  created_at: string;
  updated_at: string;
}

export interface BidInProgress {
  client_job_id: number;
  // client_user_id: number;
  form_id: number;
  scope_of_service: string;
  work_in_detail: string;
  project_location: string;
  proposal_deadline: string;
  expected_start_date: string;
  budget: number;
  job_status: string;
  created_at: string;
  updated_at: string;
  bid_count: number;
}

export interface JobInProgress {
  client_job_id: number;
  // client_user_id: number;
  form_id: number;
  scope_of_service: string;
  work_in_detail: string;
  project_location: string;
  proposal_deadline: string;
  expected_start_date: string;
  budget: number;
  job_status: string;
  created_at: string;
  updated_at: string;
}

export interface CompletedJob {
  jobId: string;
  jobName: string;
  consultant: string;
}


@Injectable({
  providedIn: 'root'
})
export class ClientJobsService {
  private BASE_URL = 'http://localhost:8000/client';

  constructor(private http: HttpClient) { }
  getPendingBids(): Observable<{ jobs: PendingBid[] }> {
    return this.http.get<{ jobs: PendingBid[] }>(`${this.BASE_URL}/pending-bids`, {
      withCredentials: true
    });
  }

  getBidsInProgress(): Observable<{ jobs: BidInProgress[] }> {
    return this.http.get<{ jobs: BidInProgress[] }>(`${this.BASE_URL}/bids-in-progress`, {
      withCredentials: true
    });
  }

  getJobsInProgress(): Observable<{ jobs: JobInProgress[] }> {
    return this.http.get<{ jobs: JobInProgress[] }>(
      `${this.BASE_URL}/jobs-in-progress`,
      { withCredentials: true }
    );
  }

  getCompletedJobs(): Observable<{ jobs: JobInProgress[] }> {
    return this.http.get<{ jobs: JobInProgress[] }>(
      `${this.BASE_URL}/completed-jobs`,
      { withCredentials: true }
    );
  }
  

  createJob(jobData: CreateJobRequest): Observable<any> {
    console.log('jobData', jobData);
    console.log('this.BASE_URL', this.BASE_URL);
    console.log('access_token', localStorage.getItem('access_token'));
    return this.http.post(`${this.BASE_URL}/create-job`, jobData, {
      withCredentials: true
    });
  }

}

