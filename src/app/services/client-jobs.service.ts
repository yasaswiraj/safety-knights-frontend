import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PendingBid {
  jobId: string;
  jobName: string;
  deadline: string;
  budget: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientJobsService {
  private baseUrl = 'http://127.0.0.1:8000/client';

  constructor(private http: HttpClient) {}

  getPendingBids(): Observable<PendingBid[]> {
    console.log('inside pending bids...');
    return this.http.get<PendingBid[]>(`${this.baseUrl}/jobs`, {
      withCredentials: true  
    });
  }
}
