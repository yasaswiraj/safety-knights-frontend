import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000'; // FastAPI backend URL

  constructor(private http: HttpClient) {}
  loginUser(loginData: any): Observable<any> {
    const formData = new URLSearchParams();
    formData.set('username', loginData.username);
    formData.set('password', loginData.password);

    return this.http.post(`${this.apiUrl}/login`, formData.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      withCredentials: true  // ✅ Ensures cookies are sent & stored
    });
  }

  // ✅ Logout API Call (Clears session)
  logoutUser(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }

  // ✅ Test authentication by trying to fetch pending bids (Relies on cookies)
  checkAuth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/client/jobs`, { withCredentials: true });
  }
}
