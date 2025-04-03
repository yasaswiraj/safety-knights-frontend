import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-vetting-user',
  standalone: true,
  imports: [CommonModule], // Add CommonModule to imports
  templateUrl: './vetting-user.component.html',
  styleUrls: ['./vetting-user.component.css']
})
export class VettingUserComponent implements OnInit, OnChanges {
  @Input() userID: number | null = null; 
  @Input() consultantDetails: any = null;

  constructor() {}

  ngOnInit() {
    console.log('User ID on init:', this.userID);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userID'] && !changes['userID'].isFirstChange()) {
      console.log('User ID changed to:', changes['userID'].currentValue);
    }
    if (changes['consultantDetails'] && !changes['consultantDetails'].isFirstChange()) {
      console.log('Consultant Details:', changes['consultantDetails'].currentValue);
    }
  }
}
