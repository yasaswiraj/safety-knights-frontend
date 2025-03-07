import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000'; // FastAPI backend URL

  constructor(private http: HttpClient) {}

  // ✅ Example: Fetch All Jobs
  getAllJobs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/client/jobs`);
  }

  // ✅ Example: User Login
  loginUser(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // ✅ Example: User Signup
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/client/signup`, userData);
  }
}
