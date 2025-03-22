import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000'; // Update with your FastAPI backend URL

  constructor(private http: HttpClient) {}

  // Example GET request to FastAPI root endpoint
  getRootMessage(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`);
  }

  // Example login request
  login(username: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    return this.http.post(`${this.apiUrl}/login`, formData, { withCredentials: true });
  }
}
