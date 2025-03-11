import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientOnboardingService {
  private formData: any = {};

  constructor(private http: HttpClient) {}

  // Save partial form data
  saveFormData(partialData: any) {
    this.formData = { ...this.formData, ...partialData };
  }

  // Get stored form data
  getFormData() {
    return this.formData;
  }

  // Submit form data to the backend
  submitForm(formData: any) {
    return this.http.post('http://127.0.0.1:8000/client/signup', formData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  
}
