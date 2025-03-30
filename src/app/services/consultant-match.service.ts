import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultantMatchesService {
  private BASE_URL = 'http://localhost:8000/consultant/matched_jobs'; // Change to your backend endpoint
   // Assuming you have a function to fetch the token

  constructor(private http: HttpClient) { }

 
  getConsultantMatches(): Observable<any> {

    return this.http.get<any>(`${this.BASE_URL}`, {
      withCredentials: true
    });
  }
}
