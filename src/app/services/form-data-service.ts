import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private formData: any = {}; // Object to store all form responses

  setFormData(step: number, data: any) {
    this.formData[`step${step}`] = data;
  }

  getFormData() {
    return this.transformData(this.formData);
  }

  resetFormData() {
    this.formData = {}; // Clear after submission
  }

  private transformData(inputData: any) {
    const consolidatedServices: { [key: string]: string[] } = {};
    
    [inputData?.step3, inputData?.step4].forEach((step) => {
        if (step?.scopeOfService && step?.dependentService) {
            step.scopeOfService.forEach((service: string) => {
                if (!consolidatedServices[service]) {
                    consolidatedServices[service] = [];
                }
                consolidatedServices[service].push(step.dependentService);
            });
        }
    });
    
    // return {
    //     name: "John Doe",
    //     email: inputData?.step2?.email || "consultanttest@gmail.com",
    //     password: inputData?.step2?.password || "SecurePass123!",
    //     confirm_password: inputData?.step2?.confirmPassword || "SecurePass123!",
    //     job_title: inputData?.step1?.jobTitle || "EHS Consultant",
    //     company_name: inputData?.step1?.companyName || "Doe Environmental Solutions",
    //     company_address: inputData?.step1?.companyAddress || "123 Green Street, New York, NY",
    //     phone_number: "+1 234-567-8901",
    //     scope_of_service: consolidatedServices,
    //     written_responses: {
    //         "Please state any specifics about availability that you may have": "I have 10+ years of experience in environmental audits.",
    //         "Additional Information, Comments or Clarifications": "Certified in ISO 14001 and OSHA safety standards."
    //     }
    // };
    return {
      name: inputData?.step1?.name || "John Doe",
      email: inputData?.step2?.email || "consultanttest@gmail.com",
      password: inputData?.step2?.password || "SecurePass123!",
      confirm_password: inputData?.step2?.confirmPassword || "SecurePass123!",
      job_title: inputData?.step1?.jobTitle || "EHS Consultant",
      company_name: inputData?.step1?.companyName || "Doe Environmental Solutions",
      company_address: inputData?.step1?.companyAddress || "123 Green Street, New York, NY",
      phone_number: "+1 234-567-8901",
      scope_of_service: consolidatedServices,
      environmental_services: [],
      property_transactions: [],
      field_activities: [],
      hazardous_materials: [],
      safety_facility_compliance: [],
      industrial_hygiene: [],
      construction_safety: [],
      written_responses: {
          "Please state any specifics about availability that you may have": "I have 10+ years of experience in environmental audits.",
          "Additional Information, Comments or Clarifications": "Certified in ISO 14001 and OSHA safety standards."
      }
  };
  
  }
}
