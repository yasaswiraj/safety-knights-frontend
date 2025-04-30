import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService } from '../../services/admin.service';
import { JobDetailComponent } from '../../components/job-detail/job-detail.component';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-matches-list',
  standalone: true,
  templateUrl: './matches-list.component.html',
  styleUrls: ['./matches-list.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSortModule,
    FormsModule,
    MatProgressSpinnerModule,
    JobDetailComponent,
    LoadingComponent
  ],
})
export class MatchesListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchQuery = '';
  dataSource: MatTableDataSource<{
    id: number;
    clientName: string;
    consultantName: string;
    bid: number;
    job_id: number;
    client_user_id: number;
    job_title: string;
    job_description: string;
    project_location: string;
    budget: number;
    job_status: string;
  }>;
  expandedElement: any = null;
  jobDetails: any = null;
  loadingDetails = false;
  totalItems = 0;
  pageSize = 15;
  currentPage = 1;
  totalPages = 1;
  isLoading = false;

  displayedColumns: string[] = [
    'id',
    'clientName',
    'consultantName',
    'bid',
    'actions'
  ];

  constructor(private adminService: AdminService) {
    this.dataSource = new MatTableDataSource<{
      id: number;
      clientName: string;
      consultantName: string;
      bid: number;
      job_id: number;
      client_user_id: number;
      job_title: string;
      job_description: string;
      project_location: string;
      budget: number;
      job_status: string;
    }>([]);
  }

  ngOnInit() {
    this.fetchMatches();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchMatches() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.adminService.getMatches(this.currentPage, this.pageSize).subscribe(
      (response) => {
        this.dataSource.data = response.items.map((match: any) => ({
          id: match.job_id,
          clientName: match.client_name || `Client ${match.client_id}`,
          consultantName: match.consultant_name || `Consultant ${match.consultant_id}`,
          bid: match.bid_value || 0,
          job_id: match.job_id,
          client_user_id: match.client_id,
          job_title: match.job_title || 'N/A',
          job_description: match.job_description || 'N/A',
          project_location: match.project_location || 'N/A',
          budget: match.budget || 0,
          job_status: match.job_status || 'N/A'
        }));
        this.totalItems = response.total;
        this.totalPages = response.pages;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching matches:', error);
        this.isLoading = false;
      }
    );
  }

  onSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleRow(match: any) {
    if (this.expandedElement === match) {
      this.expandedElement = null;
      this.jobDetails = null;
      this.loadingDetails = false;
    } else {
      this.expandedElement = match;
      this.loadingDetails = true;
      
      // Fetch job details
      this.adminService.getJobDetails(match.job_id).subscribe({
        next: (response) => {
          // Format the job details to match the expected structure
          this.jobDetails = {
            job_details: {
              job_id: response.job_details.job_id,
              job_title: response.job_details.job_title,
              job_description: response.job_details.job_description,
              project_location: response.job_details.project_location,
              budget: response.job_details.budget,
              job_status: response.job_details.job_status,
              form_id: response.job_details.form_id || 'N/A',
              scope_of_service: response.job_details.scope_of_service || 'N/A',
              work_in_detail: response.job_details.work_in_detail || 'N/A',
              proposal_deadline: response.job_details.proposal_deadline || new Date(),
              expected_start_date: response.job_details.expected_start_date || new Date(),
              insurance_values: response.job_details.insurance_values || [],
              files: response.job_details.files || []
            },
            client_details: {
              name: response.client_details.name || 'Client ' + match.client_user_id,
              email: response.client_details.email || 'N/A',
              job_title: response.client_details.job_title || 'N/A',
              company_name: response.client_details.company_name || 'N/A',
              company_address: response.client_details.company_address || 'N/A',
              contact: response.client_details.contact || 'N/A',
              average_rating: response.client_details.average_rating || 0,
              review_count: response.client_details.review_count || 0
            }
          };
          this.loadingDetails = false;
        },
        error: (error) => {
          console.error('Error fetching job details:', error);
          // Fallback to basic job details if API call fails
          this.jobDetails = {
            job_details: {
              job_id: match.job_id,
              job_title: 'N/A',
              job_description: 'N/A',
              project_location: 'N/A',
              budget: 0,
              job_status: 'N/A',
              form_id: 'N/A',
              scope_of_service: 'N/A',
              work_in_detail: 'N/A',
              proposal_deadline: new Date(),
              expected_start_date: new Date(),
              insurance_values: [],
              files: []
            },
            client_details: {
              name: 'Client ' + match.client_user_id,
              email: 'N/A',
              job_title: 'N/A',
              company_name: 'N/A',
              company_address: 'N/A',
              contact: 'N/A',
              average_rating: 0,
              review_count: 0
            }
          };
          this.loadingDetails = false;
        }
      });
    }
  }

  closeDetail(): void {
    this.expandedElement = null;
    this.jobDetails = null;
    this.loadingDetails = false;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    
    this.currentPage = page;
    this.fetchMatches();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      // If total pages is less than max visible, show all pages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of visible pages
      let start = Math.max(2, this.currentPage - 1);
      let end = Math.min(this.totalPages - 1, this.currentPage + 1);
      
      // Adjust if we're near the beginning or end
      if (this.currentPage <= 2) {
        end = 4;
      } else if (this.currentPage >= this.totalPages - 1) {
        start = this.totalPages - 3;
      }
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Add visible pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (end < this.totalPages - 1) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Always show last page
      pages.push(this.totalPages);
    }
    
    return pages;
  }
}
