// Purpose: Service to store form data to be used in multiple components.

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private formData: any = {};
  private file: File | null = null;
  private jobId: number | null = null;

  setFormData(data: any, jobId?: number) {
    this.formData = { ...this.formData, ...data }; 
    if (jobId !== undefined) this.jobId = jobId;
  }

  getFormData() {
    return this.formData;
  }

  setUploadedFile(file: File) {
    this.file = file;
  }

  getUploadedFile() {
    return this.file;
  }

  getJobId() {
    return this.jobId;
  }

  clearAll() {
    this.formData = {};
    this.file = null;
    this.jobId = null;
  }
}

