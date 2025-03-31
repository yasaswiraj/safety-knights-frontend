import { Component, Input } from '@angular/core';

// Optionally, import ConsultantSignup from your models.
// Here we define an inline interface for demonstration.
// Renamed interface from ConsultantSignup to ConsultantDetails
interface ConsultantDetails {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  job_title: string;
  company_name: string;
  company_address?: string;
  phone_number: string;
  environmental_services: string[];
  property_transactions: string[];
  field_activities: string[];
  hazardous_materials: string[];
  safety_facility_compliance: string[];
  industrial_hygiene: string[];
  written_responses: Record<string, string>;
}

@Component({
  selector: 'app-vetting-user',
  imports: [],
  templateUrl: './vetting-user.component.html',
  styleUrls: ['./vetting-user.component.css']
})
export class VettingUserComponent {
  // @Input() consultant: ConsultantDetails = {
  //   name: "John Doe",
  //   email: "johndoe@example.com",
  //   password: "password123",
  //   confirm_password: "password123",
  //   job_title: "Environmental Consultant",
  //   company_name: "Doe Consultancy",
  //   company_address: "123 Main St, City, Country",
  //   phone_number: "1234567890",
  //   environmental_services: ["Service A", "Service B"],
  //   property_transactions: ["Transaction A"],
  //   field_activities: ["Activity A"],
  //   hazardous_materials: ["Hazard Inspection"],
  //   safety_facility_compliance: ["Compliance Check"],
  //   industrial_hygiene: ["Hygiene Assessment"],
  //   written_responses: { "Q1": "Default answer", "Q2": "Default answer" }
  // };
}
