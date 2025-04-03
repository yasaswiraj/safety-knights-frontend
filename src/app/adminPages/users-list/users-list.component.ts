import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BanUserComponent } from '../../components/ban-user/ban-user.component';
import { AdminService } from '../../services/admin.service';

// Define an interface for user data
interface User {
  id: number | null;
  name: string;
  email: string;
  phone: string;
  type: string;
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
    MatProgressSpinnerModule, // Add this module
  ],
  providers: [AdminService], // Add this line to explicitly provide the service
})
export class UsersListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchQuery = '';
  dataSource: MatTableDataSource<User>; // Use the User interface as the generic type
  isLoading = true; // Add loading state

  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'phone',
    'type',
    'actions',
  ];

  users: User[] = []; // Explicitly type the users array

  constructor(private dialog: MatDialog, private adminService: AdminService) {
    this.dataSource = new MatTableDataSource<User>([]); // Use the User interface here
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.isLoading = true; // Set loading to true before fetching
    this.adminService.getAllUsers().subscribe((response: any) => {
      this.users = response.users.map((user: any, index: number) => ({
        id: index + 1, // Use index as id
        name: user.name,
        email: user.email_id,
        phone: user.contact,
        type: user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1), // Capitalize first letter
      }));
      this.dataSource.data = this.users;
      this.isLoading = false; // Set loading to false after fetching
    });
  }

  onSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openBanDialog(user: User): void { // Use the User interface here
    const dialogRef = this.dialog.open(BanUserComponent, {
      width: '400px',
      data: { userName: user.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.confirmed) {
        console.log(`Banning user ${user.name} for reason: ${result.reason}`);
        // Add your API call here to ban the user
        // You might want to refresh the users list after successful ban
      }
    });
  }
}
