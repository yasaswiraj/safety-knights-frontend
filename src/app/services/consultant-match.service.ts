import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsultantMatchesService {
  private BASE_URL = 'http://localhost:8000/consultant'; // Change to your backend endpoint
   // Assuming you have a function to fetch the token

  constructor(private http: HttpClient) { }

 
  getConsultantMatches(): Observable<any> {

    return this.http.get<any>(`${environment.apiUrl}/consultant/matched_jobs`, {
      withCredentials: true
    });
  }

  getActiveJobs(): Observable<any> {
  
    return this.http.get<any>(`${environment.apiUrl}/consultant/job_in_progress`, {
      withCredentials: true
    });
  }

  getCompletedJobs(): Observable<any> {
  
    return this.http.get<any>(`${environment.apiUrl}/consultant/completed_jobs`, {
      withCredentials: true
    });
  }

  getProfile(): Observable<any> {
  
    return this.http.get<any>(`${environment.apiUrl}/consultant/get_filled_form`, {
      withCredentials: true
    });
  }

  updateProfile(profileData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${environment.apiUrl}/consultant/consultant_update`, profileData, {  withCredentials: true });
  }
}
