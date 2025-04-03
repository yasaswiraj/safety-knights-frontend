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
    console.log("Form Data (raw):", this.formData);
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

  private transformFormData(formData: any): any {
    const categoryMap: { [key: string]: string } = {
      "Environmental Facility Compliance": "environmental_services",
      "Property Transactions": "property_transactions",
      "Field Activities": "field_activities",
      "Hazardous Materials": "hazardous_materials",
      "Safety Facility Compliance": "safety_facility_compliance",
      "Industrial Hygiene": "industrial_hygiene",
      "Construction Safety": "construction_safety"
    };
  
    let transformedData: any = {
      name: formData.step1?.name || "",
      email: formData.step2?.email || "",
      password: formData.step2?.password || "",
      confirm_password: formData.step2?.confirmPassword || "",
      job_title: formData.step1?.jobTitle || "",
      company_name: formData.step1?.companyName || "",
      company_address: formData.step1?.companyAddress || "",
      phone_number: formData.step1?.phoneNumber || "",
      written_responses: {}
    };
  
    Object.values(categoryMap).forEach((key) => {
      transformedData[key] = [];
    });
  
    ["step3", "step4", "step5"].forEach((stepKey) => {
      const step = formData[stepKey];
      if (step?.scopeOfService && step?.dependentService) {
        step.scopeOfService.forEach((service: string) => {
          const key = categoryMap[service];
          if (key) {
            transformedData[key].push(step.dependentService);
          }
        });
      }
    });
   
    console.log("Transform data:", transformedData);
    return transformedData;
  }
}

