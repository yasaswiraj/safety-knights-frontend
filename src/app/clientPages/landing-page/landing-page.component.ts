import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { HttpClient } from '@angular/common/http'; // Import HttpClient

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule], // Add HttpClientModule to imports
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  constructor(private http: HttpClient) {} // Inject HttpClient

  ngOnInit() {
    this.http.get('http://localhost:8000') // Replace with your API endpoint
      .subscribe(response => {
        console.log(response); // Log the response to the console
      });
  }
}


