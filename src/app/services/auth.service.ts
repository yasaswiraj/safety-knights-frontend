import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { access } from "fs";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  loginUser(loginData: any): Observable<{ access_token: string }> {
    const formData = new URLSearchParams();
    formData.set('username', loginData.username);
    formData.set('password', loginData.password);

    console.log(access)
  
    return this.http.post<{ access_token: string }>('http://localhost:8000/login', formData.toString(), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',  // ✅ Required for OAuth2
      }),
      withCredentials: true  // ✅ Ensures cookies are sent & received
    });
  }

  // ✅ Get Stored Access Token
  getAccessToken(): string {
    return localStorage.getItem('access_token') || '';  
  }

  // ✅ Check if User is Authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
