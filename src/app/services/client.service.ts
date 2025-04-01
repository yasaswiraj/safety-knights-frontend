import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

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
}
