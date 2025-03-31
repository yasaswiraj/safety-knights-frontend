import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-matches-list',
  standalone: true,
  templateUrl: './bids-list.component.html',
  styleUrls: ['./bids-list.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSortModule,
    FormsModule,
  ],
})
export class BidsListComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchQuery = '';
  dataSource: MatTableDataSource<any>;

  displayedColumns: string[] = [
    'id',
    'clientName',
    'consultantName',
    'bid',
    'status',
    'actions',
  ];

  matches = [
    {
      id: 34232,
      clientName: 'Yasaswi Raj',
      consultantName: 'Steve Rogers',
      bid: '5000',
      status: 'In Progress',
    },
    {
      id: 64362,
      clientName: 'Steve Rogers',
      consultantName: 'Chris Hemsworth',
      bid: '7500',
      status: 'Completed',
    },
    {
      id: 43212,
      clientName: 'Chris Hemsworth',
      consultantName: 'John Doe',
      bid: '6200',
      status: 'In Progress',
    },
    {
      id: 93242,
      clientName: 'John Doe',
      consultantName: 'Peter Stark',
      bid: '4800',
      status: 'In Progress',
    },
    {
      id: 53221,
      clientName: 'Peter Stark',
      consultantName: 'Mark Ruffalo',
      bid: '5300',
      status: 'Completed',
    },
    {
      id: 56432,
      clientName: 'Mark Ruffalo',
      consultantName: 'Natasha Romanoff',
      bid: '5900',
      status: 'Completed',
    },
    {
      id: 75339,
      clientName: 'Natasha Romanoff',
      consultantName: 'Clark Kent',
      bid: '6700',
      status: 'Completed',
    },
    {
      id: 39285,
      clientName: 'Clark Kent',
      consultantName: 'Bruce Wayne',
      bid: '7200',
      status: 'Completed',
    },
    {
      id: 32853,
      clientName: 'Bruce Wayne',
      consultantName: 'Barry Allen',
      bid: '8100',
      status: 'In Progress',
    },
    {
      id: 37538,
      clientName: 'Barry Allen',
      consultantName: 'Ana de Armas',
      bid: '9400',
      status: 'Completed',
    },
    {
      id: 45678,
      clientName: 'Sherlock Holmes',
      consultantName: 'Doctor Strange',
      bid: '10500',
      status: 'Pending',
    },
    {
      id: 89012,
      clientName: 'James Bond',
      consultantName: 'Jason Bourne',
      bid: '11500',
      status: 'Matched',
    },
    {
      id: 34567,
      clientName: 'Walter White',
      consultantName: 'Jesse Pinkman',
      bid: '12500',
      status: 'Completed',
    },
    {
      id: 78901,
      clientName: 'Jon Snow',
      consultantName: 'Daenerys Targaryen',
      bid: '13500',
      status: 'Pending',
    },
    {
      id: 23456,
      clientName: 'Rick Sanchez',
      consultantName: 'Morty Smith',
      bid: '14500',
      status: 'Matched',
    },
    {
      id: 67890,
      clientName: 'Wednesday Addams',
      consultantName: 'Enid Sinclair',
      bid: '15500',
      status: 'Completed',
    },
    {
      id: 12345,
      clientName: 'Michael Scott',
      consultantName: 'Dwight Schrute',
      bid: '16500',
      status: 'Pending',
    },
    {
      id: 90123,
      clientName: 'Luke Skywalker',
      consultantName: 'Obi-Wan Kenobi',
      bid: '17500',
      status: 'Matched',
    },
    {
      id: 56789,
      clientName: 'Harry Potter',
      consultantName: 'Albus Dumbledore',
      bid: '18500',
      status: 'Completed',
    },
    {
      id: 45123,
      clientName: 'Indiana Jones',
      consultantName: 'Lara Croft',
      bid: '19500',
      status: 'Pending',
    },
  ];

  constructor() {
    this.dataSource = new MatTableDataSource(this.matches);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  onSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
