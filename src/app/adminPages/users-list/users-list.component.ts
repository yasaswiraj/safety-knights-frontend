import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BanUserComponent } from '../../components/ban-user/ban-user.component';

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
  ],
})
export class UsersListComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchQuery = '';
  dataSource: MatTableDataSource<any>;

  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'phone',
    'type',
    'actions',
  ];

  users = [
    {
      id: 34232,
      name: 'Yasaswi Raj',
      email: 'yasaswi@profesional.com',
      phone: '643 234 4552',
      type: 'Consultant',
    },
    {
      id: 64362,
      name: 'Steve Rogers',
      email: 'steve@language.com',
      phone: '863 234 4352',
      type: 'Client',
    },
    {
      id: 43212,
      name: 'Chris Hemsworth',
      email: 'chrish@pointbreak.com',
      phone: '534 234 4528',
      type: 'Consultant',
    },
    {
      id: 93242,
      name: 'John Doe',
      email: 'john@hey.com',
      phone: '753 231 7532',
      type: 'Consultant',
    },
    {
      id: 53221,
      name: 'Peter Stark',
      email: 'ironspider@starkindustries.com',
      phone: '643 234 4552',
      type: 'Client',
    },
    {
      id: 56432,
      name: 'Mark Ruffalo',
      email: 'angrybigguy@greenlove.com',
      phone: '643 234 4552',
      type: 'Client',
    },
    {
      id: 75339,
      name: 'Natasha Romanoff',
      email: 'natsha@widows.com',
      phone: '643 234 4552',
      type: 'Client',
    },
    {
      id: 39285,
      name: 'Clark Kent',
      email: 'karel@justiceleague.com',
      phone: '643 234 4552',
      type: 'Client',
    },
    {
      id: 32853,
      name: 'Bruce Wayne',
      email: 'billionairefromdc@plotarmour.com',
      phone: '643 234 4552',
      type: 'Consultant',
    },
    {
      id: 37538,
      name: 'Barry Allen',
      email: 'timetraveller@justiceleague.com',
      phone: '643 234 4552',
      type: 'Client',
    },
    {
      id: 9472,
      name: 'Ana de Armas',
      email: 'mywife@iwish.com',
      phone: '643 234 4552',
      type: 'Client',
    },
    {
      id: 79342,
      name: 'Voldemort',
      email: 'tomriddle@thedeatheaters.com',
      phone: '666 234 4552',
      type: 'Client',
    },
    {
      id: 89532,
      name: 'Harry Potter',
      email: 'theboywholived@griffindor.com',
      phone: '643 234 4552',
      type: 'Consultant',
    },
    {
      id: 45231,
      name: 'Sherlock Holmes',
      email: 'detective@bakerstreet.com',
      phone: '444 221 7891',
      type: 'Consultant',
    },
    {
      id: 67123,
      name: 'James Bond',
      email: '007@mi6.gov.uk',
      phone: '007 007 0007',
      type: 'Client',
    },
    {
      id: 89124,
      name: 'Walter White',
      email: 'heisenberg@crystal.com',
      phone: '505 842 4455',
      type: 'Consultant',
    },
    {
      id: 34789,
      name: 'Jon Snow',
      email: 'kinginthenorth@winterfell.got',
      phone: '888 123 4567',
      type: 'Client',
    },
    {
      id: 56234,
      name: 'Eleven',
      email: 'eleven@hawkins.lab',
      phone: '111 111 1111',
      type: 'Consultant',
    },
    {
      id: 78901,
      name: 'Doctor Who',
      email: 'doctor@tardis.time',
      phone: '123 456 7890',
      type: 'Consultant',
    },
    {
      id: 23456,
      name: 'Rick Sanchez',
      email: 'rick@c137.universe',
      phone: '137 137 1377',
      type: 'Client',
    },
    {
      id: 90123,
      name: 'Wednesday Addams',
      email: 'wednesday@nevermore.edu',
      phone: '666 666 6666',
      type: 'Consultant',
    },
  ];

  constructor(private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(this.users);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  onSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openBanDialog(user: any): void {
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
