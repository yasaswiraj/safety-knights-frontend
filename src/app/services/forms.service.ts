import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  constructor(private http: HttpClient) {}

  getFormStructure(formId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/forms/get-form-structure/${formId}`, { withCredentials: true });
  }
  
  getOptionsForQuestion(questionId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/forms/get-options/${questionId}`, { withCredentials: true });
  }
  
  getClientResponsesDetailed(clientResponseId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/forms/get-client-responses-detailed/${clientResponseId}`, { withCredentials: true });
  }
}