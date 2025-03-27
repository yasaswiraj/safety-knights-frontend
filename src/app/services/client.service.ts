import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private BASE_URL = 'http://localhost:8000/client';

  constructor(private http: HttpClient) {}

  getBidsInProgress(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/bids-in-progress`, { withCredentials: true });
  }
}
