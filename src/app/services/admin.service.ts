import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  constructor(private http: HttpClient) {}

  getAllUsers(page: number = 1, size: number = 50): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/users?page=${page}&size=${size}`, { withCredentials: true });
  }

  getVettedUsers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/users/vetting`, { withCredentials: true });
  }

  getConsultantDetail(user_id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/get_consultant_detail/${user_id}`, { withCredentials: true });
  }

  getClientDetail(user_id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/get_client_detail/${user_id}`, { withCredentials: true });
  }

  getJobDetails(job_id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/job_details/${job_id}`, { withCredentials: true });
  }

  approveUser(user_id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/user_approve/${user_id}`, {}, { withCredentials: true });
  }

  getBids(page: number = 1, size: number = 10): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/admin/bids?page=${page}&size=${size}`, { withCredentials: true });
  }

  getMatches(page: number = 1, size: number = 10): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/admin/matches?page=${page}&size=${size}`, { withCredentials: true });
  }

  getTotalBids(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/admin/total_bids`, { withCredentials: true });
  }

  getTotalMatchedJobs(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/admin/total_matched_jobs`, { withCredentials: true });
  }

  getTotalJobs(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/admin/total_jobs`, { withCredentials: true });
  }

  getQuestions(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/questions`, { withCredentials: true });
  }

  getOptionsByQuestionId(questionId: number): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/admin/questions/${questionId}/options`, { withCredentials: true });
  }

  getUserFiles(userId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/user/${userId}/files`, { withCredentials: true });
  }

  getFileById(fileId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/file/${fileId}`, { 
      withCredentials: true,
      responseType: 'blob'  // Important for file downloads
    });
  }

  editQuestion(questionId: number, questionData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/admin/questions/${questionId}`, questionData, { withCredentials: true });
  }

  banUser(user_id: number, banData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/ban/${user_id}`, banData, { withCredentials: true });
  }

  unbanUser(user_id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/unban/${user_id}`, {}, { withCredentials: true });
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
