// Purpose: Service to store form data to be used in multiple components.

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private formData: any = {};
  private file: File | null = null;

  setFormData(data: any) {
    this.formData = { ...this.formData, ...data };
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

  clearAll() {
    this.formData = {};
    this.file = null;
  }
}

