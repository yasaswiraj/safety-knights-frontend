import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/users`, { withCredentials: true });
  }

  getVettedUsers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/users/vetting`, { withCredentials: true });
  }

  getConsultantDetail(user_id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/get_consultant_detail/${user_id}`, { withCredentials: true });
  }
}
