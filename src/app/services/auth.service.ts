import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { access } from "fs";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  loginUser(loginData: any): Observable<{ access_token: string }> {
    const formData = new URLSearchParams();
    formData.set('username', loginData.username);
    formData.set('password', loginData.password);

    console.log(access)
  
    return this.http.post<{ access_token: string }>('`${environment.apiUrl}/login', formData.toString(), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',  
      }),
      withCredentials: true  
    });
  }

  getAccessToken(): string {
    return localStorage.getItem('access_token') || '';  
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
