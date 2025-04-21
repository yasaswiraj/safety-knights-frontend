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

  approveUser(user_id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/user_approve/${user_id}`, {}, { withCredentials: true });
  }

  getBids(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/admin/bids`, { withCredentials: true });
  }

  getQuestions(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/questions`, { withCredentials: true });
  }

  getOptionsByQuestionId(questionId: number): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/admin/questions/${questionId}/options`, { withCredentials: true });
  }

  editQuestion(questionId: number, questionData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/admin/questions/${questionId}`, questionData, { withCredentials: true });
  }

  banUser(user_id: number, banData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/ban/${user_id}`, banData, { withCredentials: true });
  }

  rejectUser(user_id: number, rejectData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/reject/${user_id}`, rejectData, { withCredentials: true });
  }

  updateOption(answerId: number, optionData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/admin/options/${answerId}`, optionData, { withCredentials: true });
  }

  deleteOption(answerId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/admin/options/${answerId}`, { withCredentials: true });
  }

  createOption(optionData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/options/create`, optionData, { withCredentials: true });
  }
}
