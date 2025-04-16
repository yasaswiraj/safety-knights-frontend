import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { VettingUserComponent } from "../../components/vetting-user/vetting-user.component";
import { AdminService } from '../../services/admin.service'; // Import the new service
import { Router } from '@angular/router'; // Import Router for navigation

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
export class VettingComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<{ 
    user_id: number; 
    name: string; 
    email_id: string; 
    job_title: string; 
    company_name: string; 
    contact: string; 
  }>; // Explicitly define the type
  displayedColumns: string[] = ['user_id', 'name', 'email_id', 'job_title', 'company_name', 'contact', 'actions'];
  expandedElement: any = null;
  consultantDetails: any = null; // Store fetched consultant details
  loading: boolean = false; // Add loading flag

  constructor(private adminService: AdminService, private router: Router) { // Add Router to constructor
    this.dataSource = new MatTableDataSource<{ 
      user_id: number; 
      name: string; 
      email_id: string; 
      job_title: string; 
      company_name: string; 
      contact: string; 
    }>([]); // Explicitly define the type
  }

  ngOnInit() {
    this.fetchVettedUsers();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchVettedUsers() {
    this.adminService.getVettedUsers().subscribe(
      (data) => {
        this.dataSource.data = data;
      },
      (error) => {
        console.error('Error fetching vetted users:', error);
      }
    );
  }

  onSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleRow(consultant: any) {
    if (this.expandedElement === consultant) {
      this.expandedElement = null;
      this.consultantDetails = null; // Clear details when collapsing
      this.loading = false; // Reset loading flag
    } else {
      this.expandedElement = consultant;
      this.loading = true; // Set loading flag
      this.adminService.getConsultantDetail(consultant.user_id).subscribe(
        (data) => {
          this.consultantDetails = data; // Store fetched details
          this.loading = false; // Clear loading flag
        },
        (error) => {
          console.error('Error fetching consultant details:', error);
          this.loading = false; // Clear loading flag on error
        }
      );
    }
  }

  approve(consultant: any) {
    this.adminService.approveUser(consultant.user_id).subscribe(
      () => {
        console.log('User approved successfully:', consultant);
        alert('User approved successfully!'); // Show success message
        this.closeDetail(); // Close the expansion
        this.fetchVettedUsers(); // Refresh the vetted users list
      },
      (error) => {
        console.error('Error approving user:', error);
      }
    );
  }

  decline(consultant: any) {
    console.log('Declined', consultant);
  }

  requestChanges(consultant: any): void {
    this.router.navigate(['/admin/chat'], { state: { chatWith: consultant } });
  }

  addFile(consultant: any) {
    console.log('Add file for', consultant);
  }

  isExpansionDetailRow = (index: number, row: any) => row === this.expandedElement;

  /**
   * Closes the detailed view and resets the expanded element
   */
  closeDetail(): void {
    this.expandedElement = null; // Ensure expandedElement is reset
    this.consultantDetails = null; // Clear consultant details
    this.loading = false; // Reset loading flag
  }
}
