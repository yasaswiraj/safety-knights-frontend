import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ConsultantJobBiddedService {
  //  private BASE_URL = 'http://localhost:8000/consultant/get_bids_in_progress'; // Change to your backend endpoint
     // Assuming you have a function to fetch the token
  
    constructor(private http: HttpClient) { }
  
   
    getBiddedJobs(): Observable<any> {
  
      return this.http.get<any>(`${environment.apiUrl}/consultant/get_bids_in_progress`, {
        withCredentials: true
      });
    }
  
}
