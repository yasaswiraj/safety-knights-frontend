import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { FormStructure } from '../interfaces/form.interface';

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
  // user_id: number;
  client_user_id: number;
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

export interface ClientProfileUpdate {
  name: string;
  job_title: string;
  company_name: string;
  company_address: string;
  phone_number: string;
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
  files_by_category?: Record<string, any[]>;

}

export interface FileUploadResponse {
  success: boolean;
  message: string;
  fileLocations?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ClientJobsService {
  getClosedJobs(): Observable<{ jobs: CompletedJob[] }> {
    return this.http.get<{ jobs: CompletedJob[] }>(
      `${environment.apiUrl}/client/closed-jobs`,
      { withCredentials: true }
    );
  }

  constructor(private http: HttpClient) { }
  getPendingBids(): Observable<{ jobs: PendingBid[] }> {
    return this.http.get<{ jobs: PendingBid[] }>(`${environment.apiUrl}/client/pending-bids`, {
      withCredentials: true
    });
  }

  getBidsInProgress(): Observable<{ jobs: BidInProgress[] }> {
    console.log('getBidsInProgress');
    return this.http.get<{ jobs: BidInProgress[] }>(`${environment.apiUrl}/client/bids-in-progress`, {
      withCredentials: true
    });
  }

  getJobsInProgress(): Observable<{ jobs: JobInProgress[] }> {
    return this.http.get<{ jobs: JobInProgress[] }>(
      `${environment.apiUrl}/client/jobs-in-progress`,
      { withCredentials: true }
    );
  }

  getCompletedJobs(): Observable<{ jobs: CompletedJob[] }> {
    return this.http.get<{ jobs: CompletedJob[] }>(`${environment.apiUrl}/client/completed_jobs`, {
      withCredentials: true
    });
  }

  postReview(data: {
    job_id: number;
    consultant_user_id: number;
    review: string;
    rating: number;
  }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/client/post_review`, data, {
      withCredentials: true
    });
  }

  createJob(jobData: CreateJobRequest): Observable<any> {
    console.log('Creating job with data:', jobData);
    return this.http.post(`${environment.apiUrl}/client/create-job`, jobData, {
      withCredentials: true
    });
  }

  // client-jobs.service.ts
  updateJob(jobId: number, jobData: CreateJobRequest): Observable<any> {
    console.log('Updating job with ID:', jobId, 'and data:', jobData);
    return this.http.post(`${environment.apiUrl}/client/update-job/${jobId}`, jobData, {
      withCredentials: true
    });
  }

  getFilledForm(jobId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/client/get_filled_form/${jobId}`, { responseType: 'text', withCredentials: true })
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
      `${environment.apiUrl}/client/get_consultant_profile/${consultantId}`,
      { withCredentials: true }
    );
  }

  acceptBid(jobId: number, consultantId: number) {
    return this.http.post(`${environment.apiUrl}/client/accept_bid/${jobId}/${consultantId}`, {}, {
      withCredentials: true
    });
  }

  getClientProfile(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/client/profile`, {
      withCredentials: true
    });
  }

  getConsultantFiles(userId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/user/${userId}/files`, {
      withCredentials: true,
    });
  }
  

  updateClientProfile(payload: ClientProfileUpdate): Observable<any> {
    return this.http.post(`${environment.apiUrl}/client/update_profile`, payload, {
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

  getClientFormStructure(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/client/get_client_form`, {
      withCredentials: true
    });
  }

  getClientForm4Structure(): Observable<FormStructure> {
    return this.http.get<FormStructure>(`${environment.apiUrl}/api/forms/client-form-4`);
  }

  getFormStructure(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/client/get_client_form`, {
      withCredentials: true
    });
  }

  submitForm(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/client/create-job`, data, {
      withCredentials: true
    });
  }

  updateClosedJobToCompleted(jobId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/client/update_closed_job_to_completed/${jobId}`, {}, {
      withCredentials: true
    });
  }

  updateClosedJobToInProgress(jobId: number, comment: string): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/client/update_closed_job_in_progress/${jobId}`,
      { comment },
      { withCredentials: true }
    );
  }

  uploadFiles(formData: FormData): Observable<FileUploadResponse> {
    return this.http.post<FileUploadResponse>(
      `${environment.apiUrl}/upload-multiple-files`, 
      formData,
      { withCredentials: true }
    );
  }
}

