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
  ],
})
export class MatchesListComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchQuery: string = '';
  dataSource: MatTableDataSource<any>;

  displayedColumns: string[] = [
    'id',
    'clientName',
    'consultantName',
    'bid',
    'actions',
  ];

  matches = [
    {
      id: 34232,
      clientName: 'Yasaswi Raj',
      consultantName: 'Steve Rogers',
      bid: '1000',
    },
    {
      id: 64362,
      clientName: 'Steve Rogers',
      consultantName: 'Chris Hemsworth',
      bid: '1500',
    },
    {
      id: 43212,
      clientName: 'Chris Hemsworth',
      consultantName: 'John Doe',
      bid: '2000',
    },
    {
      id: 93242,
      clientName: 'John Doe',
      consultantName: 'Peter Stark',
      bid: '2500',
    },
    {
      id: 53221,
      clientName: 'Peter Stark',
      consultantName: 'Mark Ruffalo',
      bid: '3000',
    },
    {
      id: 56432,
      clientName: 'Mark Ruffalo',
      consultantName: 'Natasha Romanoff',
      bid: '3500',
    },
    {
      id: 75339,
      clientName: 'Natasha Romanoff',
      consultantName: 'Clark Kent',
      bid: '4000',
    },
    {
      id: 39285,
      clientName: 'Clark Kent',
      consultantName: 'Bruce Wayne',
      bid: '4500',
    },
    {
      id: 32853,
      clientName: 'Bruce Wayne',
      consultantName: 'Barry Allen',
      bid: '5000',
    },
    {
      id: 37538,
      clientName: 'Barry Allen',
      consultantName: 'Ana de Armas',
      bid: '5500',
    },
    {
      id: 45678,
      clientName: 'Sherlock Holmes',
      consultantName: 'Doctor Strange',
      bid: '6000',
    },
    {
      id: 89012,
      clientName: 'James Bond',
      consultantName: 'Jason Bourne',
      bid: '6500',
    },
    {
      id: 34567,
      clientName: 'Walter White',
      consultantName: 'Jesse Pinkman',
      bid: '7000',
    },
    {
      id: 78901,
      clientName: 'Jon Snow',
      consultantName: 'Daenerys Targaryen',
      bid: '7500',
    },
    {
      id: 23456,
      clientName: 'Rick Sanchez',
      consultantName: 'Morty Smith',
      bid: '8000',
    },
    {
      id: 67890,
      clientName: 'Wednesday Addams',
      consultantName: 'Enid Sinclair',
      bid: '8500',
    },
    {
      id: 12345,
      clientName: 'Michael Scott',
      consultantName: 'Dwight Schrute',
      bid: '9000',
    },
    {
      id: 90123,
      clientName: 'Luke Skywalker',
      consultantName: 'Obi-Wan Kenobi',
      bid: '9500',
    },
    {
      id: 56789,
      clientName: 'Harry Potter',
      consultantName: 'Albus Dumbledore',
      bid: '10000',
    },
    {
      id: 45123,
      clientName: 'Indiana Jones',
      consultantName: 'Lara Croft',
      bid: '10500',
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
