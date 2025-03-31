import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultantJobBiddedService {
   private BASE_URL = 'http://localhost:8000/consultant/get_bids_in_progress'; // Change to your backend endpoint
     // Assuming you have a function to fetch the token
  
    constructor(private http: HttpClient) { }
  
   
    getBiddedJobs(): Observable<any> {
  
      return this.http.get<any>(`${this.BASE_URL}`, {
        withCredentials: true
      });
    }
  
}
