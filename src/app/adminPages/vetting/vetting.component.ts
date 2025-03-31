import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { VettingUserComponent } from "../../components/vetting-user/vetting-user.component";

// Define ConsultantDetails interface (must match the one in vetting-user.component)
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
  selector: 'app-vetting',
  standalone: true,
  templateUrl: './vetting.component.html',
  styleUrls: ['./vetting.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    FormsModule,
    VettingUserComponent
]
})
export class VettingComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name', 'actions'];
  expandedElement: any = null;

  consultants = [
    { id: 1, name: 'Consultant One' },
    { id: 2, name: 'Consultant Two' },
    { id: 3, name: 'Consultant Three' },
    { id: 4, name: 'Consultant Four' }
  ];

  consultant: ConsultantDetails = {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    password: "dummyPassword",
    confirm_password: "dummyPassword",
    job_title: "Industrial Hygienist",
    company_name: "Smith Consulting",
    company_address: "456 Secondary St, Town, Country",
    phone_number: "0987654321",
    environmental_services: ["Service X"],
    property_transactions: ["Transaction Y"],
    field_activities: ["Activity Z"],
    hazardous_materials: ["Hazard Inspection"],
    safety_facility_compliance: ["Compliance Check"],
    industrial_hygiene: ["Hygiene Assessment"],
    written_responses: { "Q1": "Answer 1", "Q2": "Answer 2" }
  };

  constructor() {
    this.dataSource = new MatTableDataSource(this.consultants);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  onSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleRow(consultant: any) {
    if (this.expandedElement === consultant) {
      this.expandedElement = null;
      // This will make app-vetting-user hidden and the table section visible
    } else {
      this.expandedElement = consultant;
      // This will make app-vetting-user visible and the table section invisible
    }
  }

  approve(consultant: any) {
    console.log('Approved', consultant);
  }

  decline(consultant: any) {
    console.log('Declined', consultant);
  }

  requestChanges(consultant: any) {
    console.log('Requested changes for', consultant);
  }

  addFile(consultant: any) {
    console.log('Add file for', consultant);
  }

  isExpansionDetailRow = (index: number, row: any) => row === this.expandedElement;

  /**
   * Closes the detailed view and resets the expanded element
   */
  closeDetail(): void {
    this.expandedElement = false;
  }
}
