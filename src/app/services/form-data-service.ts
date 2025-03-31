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
    console.log("Form Data:", this.formData); // Log the form data for debugging
    return this.transformFormData(this.formData);
  }

  resetFormData() {
    this.formData = {}; // Clear after submission
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
      phone_number: formData.step1?.phoneNumber || "", // If phone number exists in step1
      written_responses: {}
    };
  
    // Initialize service categories
    Object.values(categoryMap).forEach((key) => {
      transformedData[key] = [];
    });
  
    // Iterate over steps to populate services
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
   console.log("Transform data :",transformedData);
    return transformedData;

  //   return {
  //     name: inputData?.step1?.name || "John Doe",
  //     email: inputData?.step2?.email || "consultanttest@gmail.com",
  //     password: inputData?.step2?.password || "SecurePass123!",
  //     confirm_password: inputData?.step2?.confirmPassword || "SecurePass123!",
  //     job_title: inputData?.step1?.jobTitle || "EHS Consultant",
  //     company_name: inputData?.step1?.companyName || "Doe Environmental Solutions",
  //     company_address: inputData?.step1?.companyAddress || "123 Green Street, New York, NY",
  //     phone_number: "+1 234-567-8901",
  //     scope_of_service: consolidatedServices,
  //     environmental_services: [],
  //     property_transactions: [],
  //     field_activities: [],
  //     hazardous_materials: [],
  //     safety_facility_compliance: [],
  //     industrial_hygiene: [],
  //     construction_safety: [],
  //     written_responses: {
  //         "Please state any specifics about availability that you may have": "I have 10+ years of experience in environmental audits.",
  //         "Additional Information, Comments or Clarifications": "Certified in ISO 14001 and OSHA safety standards."
  //     }
  // };
  }
 
   
  
}
