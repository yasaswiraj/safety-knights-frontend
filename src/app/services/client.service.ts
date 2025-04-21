import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Bid {
  jobId: number;
  jobName: string;
  deadline: string;
  numBids: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) {}

  getBidsInProgress(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/bids-in-progress`, { withCredentials: true });
  }

  createJobWithResponses(formData: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/client/create-job-with-responses`, formData, {
      withCredentials: true
    });
  }
  
  updateJobWithResponses(jobId: number, formData: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/client/update-job-with-responses/${jobId}`, formData, {
      withCredentials: true
    });
  }


  uploadJobFile(fileData: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/upload-multiple-files`, fileData, {
      withCredentials: true
    });
  }
  
}
