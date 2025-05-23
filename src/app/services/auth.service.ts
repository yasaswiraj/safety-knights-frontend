import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { jwtDecode } from 'jwt-decode';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  loginUser(loginData: any): Observable<{ access_token: string }> {
    const formData = new URLSearchParams();
    formData.set('username', loginData.username);
    formData.set('password', loginData.password);

    return this.http.post<{ access_token: string }>('`${environment.apiUrl}/login', formData.toString(), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      withCredentials: true
    });
  }

  getCurrentUserFromToken(): { user_id: number } | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return { user_id: decoded.sub };  // or decoded.user_id if your token includes that
    } catch (err) {
      return null;
    }
  }

  getAccessToken(): string {
    return localStorage.getItem('access_token') || '';
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getCurrentUserId(): number {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user?.user_id;
  }

  // Send Forgot Password Email
sendForgotPassword(email: string): Observable<any> {
  return this.http.post(`${environment.apiUrl}/forgot-password`, { email }, {
    withCredentials: true
  });
}

// Verify OTP
verifyOtp(email: string, otp: string): Observable<any> {
  return this.http.post(`${environment.apiUrl}/verify-otp`, { email, otp }, {
    withCredentials: true
  });
}

// Reset Password
resetPassword(email: string, otp: string, new_password: string): Observable<any> {
  return this.http.post(`${environment.apiUrl}/reset-password`, {
    email,
    otp,
    new_password
  }, {
    withCredentials: true
  });
}

}


