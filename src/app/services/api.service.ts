import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}
  loginUser(loginData: any): Observable<any> {
    const formData = new URLSearchParams();
    formData.set('username', loginData.username);
    formData.set('password', loginData.password);

    return this.http.post(`${environment.apiUrl}/login`, formData.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      withCredentials: true  
    });
  }

  logoutUser(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/logout`, {}, { withCredentials: true });
  }

  checkAuth(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/client/jobs`, { withCredentials: true });
  }
}
