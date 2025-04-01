import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';


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
  payment_terms?: string;
  payment_method?: string;
  other_payment_term?: string;
  other_payment_method?: string;
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
  consultant_user_id: number;
  bid_amount: number;
}

export interface JobInProgress {
  client_job_id: number;
  scope_of_service: string;
  work_in_detail: string;
  project_location: string;
  proposal_deadline: string;
  expected_start_date: string;
  budget: number;
} 

export interface CompletedJob {
  client_job_id: number;
  scope_of_service: string;
  consultant_company: string;
  bid_amount: number;
  proposal_deadline: string;
  expected_start_date: string;
  consultant_user_id: number; 
  
}


export interface ConsultantProfile {
  user_id: number;
  name: string;
  email: string;
  job_title: string;
  company_name: string;
  company_address: string;
  contact: string;
  user_status: string;
  statistics: {
    total_jobs: number;
    completed_jobs: number;
    active_jobs: number;
    average_rating: number;
    total_reviews: number;
  };
  files: {
    file_id: number;
    file_location: string;
    question: string;
    file_type: string;
  }[];
  recent_reviews: {
    review: string;
    rating: number;
    client_name: string;
    created_at: string;
  }[];
}



@Injectable({
  providedIn: 'root'
})
export class ClientJobsService {

  constructor(private http: HttpClient) { }
  getPendingBids(): Observable<{ jobs: PendingBid[] }> {
    return this.http.get<{ jobs: PendingBid[] }>(`${environment.apiUrl}/pending-bids`, {
      withCredentials: true
    });
  }

  getBidsInProgress(): Observable<{ jobs: BidInProgress[] }> {
    console.log('getBidsInProgress');
    return this.http.get<{ jobs: BidInProgress[] }>(`${environment.apiUrl}/bids-in-progress`, {
      withCredentials: true
    });
  }

  getJobsInProgress(): Observable<{ jobs: JobInProgress[] }> {
    return this.http.get<{ jobs: JobInProgress[] }>(
      `${environment.apiUrl}/jobs-in-progress`,
      { withCredentials: true }
    );
  }

  getCompletedJobs(): Observable<{ jobs: CompletedJob[] }> {
    return this.http.get<{ jobs: CompletedJob[] }>(`${environment.apiUrl}/completed_jobs`, {
      withCredentials: true
    });
  }
  
  postReview(data: {
    job_id: number;
    consultant_user_id: number;
    review: string;
    rating: number;
  }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/post_review`, data, {
      withCredentials: true
    });
  }
  


  createJob(jobData: CreateJobRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/create-job`, jobData, {
      withCredentials: true
    });
  }

  // client-jobs.service.ts
  updateJob(jobId: number, jobData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/update-job/${jobId}`, jobData, {
      withCredentials: true
    });
  }

  getFilledForm(jobId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/get_filled_form/${jobId}`, { responseType: 'text', withCredentials: true })
      .pipe(
        map((res: string) => {
          try {
            const parsed = JSON.parse(res);

            if (parsed.filled_form?.job_details) {
              const jd = parsed.filled_form.job_details;
              jd.proposal_deadline = this.fixDate(jd.proposal_deadline);
              jd.expected_start_date = this.fixDate(jd.expected_start_date);
            }

            return parsed;
          } catch (e) {
            console.error('JSON parsing failed:', e);
            return null;
          }
        })
      );
  }

  getConsultantProfile(consultantId: number): Observable<ConsultantProfile> {
    return this.http.get<ConsultantProfile>(
      `${environment.apiUrl}/get_consultant_profile/${consultantId}`,
      { withCredentials: true }
    );
  }

  acceptBid(jobId: number, consultantId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/accept_bid/${jobId}/${consultantId}`, {}, {
      withCredentials: true
    });
  }
  
  


  // Optional helper
  private fixDate(date: any): string | null {
    try {
      const d = new Date(date);
      return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0]; // returns yyyy-MM-dd
    } catch {
      return null;
    }
  }

  hasReview(jobId: number): Observable<boolean> {
    return this.http.get<{ has_review: boolean }>(`${environment.apiUrl}/has_review/${jobId}`, {
      withCredentials: true
    }).pipe(map(res => res.has_review));
  }
  

}

