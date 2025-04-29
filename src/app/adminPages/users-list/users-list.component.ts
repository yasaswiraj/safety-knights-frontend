import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BanUserComponent } from '../../components/ban-user/ban-user.component';
import { UnbanUserComponent } from '../../components/unban-user/unban-user.component';
import { ConsultantDetailComponent } from '../../components/consultant-detail/consultant-detail.component';
import { ClientDetailComponent } from '../../components/client-detail/client-detail.component';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';

// Define an interface for user data
interface User {
  id: number | null;
  name: string;
  email: string;
  phone: string;
  type: string;
  job_title?: string;
  company_name?: string;
  user_status?: string;
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSortModule,
    FormsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ConsultantDetailComponent,
    ClientDetailComponent,
  ],
  providers: [AdminService],
})
export class UsersListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchQuery = '';
  dataSource: MatTableDataSource<User>;
  isLoading = true;
  expandedElement: User | null = null;
  userDetails: any = null;
  loadingDetails = false;

  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'phone',
    'type',
    'user_status',
    'actions'
  ];

  users: User[] = [];

  constructor(
    private dialog: MatDialog,
    private adminService: AdminService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<User>([]);
    
    // Add custom filter predicate
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const searchStr = filter.toLowerCase();
      return (
        data.name.toLowerCase().includes(searchStr) ||
        data.email.toLowerCase().includes(searchStr) ||
        data.phone.toLowerCase().includes(searchStr) ||
        data.type.toLowerCase().includes(searchStr) ||
        (data.job_title ? data.job_title.toLowerCase().includes(searchStr) : false) ||
        (data.company_name ? data.company_name.toLowerCase().includes(searchStr) : false)
      );
    };
  }

  ngAfterViewInit() {
    // Set the sort property
    this.dataSource.sort = this.sort;
    
    // Add custom sort function
    this.dataSource.sortingDataAccessor = (item: User, property: string) => {
      switch(property) {
        case 'id':
          return item.id ?? 0;
        case 'name':
          return item.name;
        case 'email':
          return item.email;
        case 'phone':
          return item.phone;
        case 'type':
          return item.type;
        default:
          return '';
      }
    };
  }

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe((response: any) => {
      // Make sure we're getting the expected data structure
      console.log('Users data:', response);
      
      if (response && response.users) {
        this.users = response.users.map((user: any, index: number) => ({
          id: user.user_id,
          name: user.name || '',
          email: user.email_id || '',
          phone: user.contact || '',
          type: user.user_type ? user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1) : '',
          job_title: user.job_title || '',
          company_name: user.company_name || '',
          user_status: user.user_status || ''
        }));
        
        // Set the data source
        this.dataSource = new MatTableDataSource<User>(this.users);
        
        // Re-apply the sort and filter
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (item: User, property: string) => {
          switch(property) {
            case 'id':
              return item.id ?? 0;
            case 'name':
              return item.name;
            case 'email':
              return item.email;
            case 'phone':
              return item.phone;
            case 'type':
              return item.type;
            default:
              return '';
          }
        };
        
        // Re-apply the filter predicate
        this.dataSource.filterPredicate = (data: User, filter: string) => {
          const searchStr = filter.toLowerCase();
          return (
            data.name.toLowerCase().includes(searchStr) ||
            data.email.toLowerCase().includes(searchStr) ||
            data.phone.toLowerCase().includes(searchStr) ||
            data.type.toLowerCase().includes(searchStr) ||
            (data.job_title ? data.job_title.toLowerCase().includes(searchStr) : false) ||
            (data.company_name ? data.company_name.toLowerCase().includes(searchStr) : false)
          );
        };
      } else {
        console.error('Unexpected data structure:', response);
        this.users = [];
        this.dataSource.data = [];
      }
      
      this.isLoading = false;
    }, error => {
      console.error('Error fetching users:', error);
      this.isLoading = false;
    });
  }

  onSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    // If the filter is empty, reset to show all data
    if (filterValue === '') {
      this.dataSource.filter = '';
    }
  }

  toggleRow(user: User) {
    if (this.expandedElement === user) {
      this.expandedElement = null;
      this.userDetails = null;
      this.loadingDetails = false;
    } else {
      this.expandedElement = user;
      this.loadingDetails = true;
      
      // If the user is a consultant, fetch detailed information
      if (user.type === 'Consultant') {
        this.adminService.getConsultantDetail(user.id!).subscribe(
          (data) => {
            this.userDetails = data;
            this.loadingDetails = false;
          },
          (error) => {
            console.error('Error fetching consultant details:', error);
            // Fallback to basic user data if API call fails
            this.userDetails = user;
            this.loadingDetails = false;
          }
        );
      } else if (user.type === 'Client') {
        // For client users, fetch detailed information
        this.adminService.getClientDetail(user.id!).subscribe(
          (data) => {
            this.userDetails = data;
            this.loadingDetails = false;
          },
          (error) => {
            console.error('Error fetching client details:', error);
            // Fallback to basic user data if API call fails
            this.userDetails = user;
            this.loadingDetails = false;
          }
        );
      } else {
        // For other user types, just use the basic user data
        this.userDetails = user;
        this.loadingDetails = false;
      }
    }
  }

  closeDetail(): void {
    this.expandedElement = null;
    this.userDetails = null;
    this.loadingDetails = false;
  }

  sendMessage(user: User): void {
    const chat = {
      id: user.id,
      user: {
        name: user.name,
        avatar: this.getRandomAvatar(user.id ?? 0),
      },
      lastMessage: '',
      time: this.formatTime(new Date().toISOString()),
      isOnline: false,
    };
    this.router.navigate(['/admin/chat'], { state: { chatWith: chat } });
  }

  formatTime(isoTime: string): string {
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getRandomAvatar(seed: number): string {
    return `https://randomuser.me/api/portraits/men/${seed % 100}.jpg`;
  }

  openBanDialog(user: User): void {
    const dialogRef = this.dialog.open(BanUserComponent, {
      width: '400px',
      data: { userName: user.name, userId: user.id },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.confirmed) {
        console.log(`Banning user ${user.name} for reason: ${result.reason}`);
        this.fetchUsers(); // Refresh the users list after banning
      }
    });
  }

  unbanUser(user: User): void {
    const dialogRef = this.dialog.open(UnbanUserComponent, {
      width: '400px',
      data: { 
        userName: user.name,
        userId: user.id,
        userType: user.type
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.confirmed) {
        console.log(`User ${user.name} has been unbanned`);
        this.fetchUsers(); // Refresh the users list
      }
    });
  }
}
