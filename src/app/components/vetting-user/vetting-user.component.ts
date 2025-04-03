import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { AdminService } from '../../services/admin.service'; // Import AdminService

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
  @Output() closeExpansion = new EventEmitter<void>(); // Emit event to close expansion
  @Output() refreshVettedUsers = new EventEmitter<void>(); // Emit event to refresh vetted users

  constructor(private adminService: AdminService) {} // Inject AdminService

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

  approve() {
    console.log('Approved', this.consultantDetails);
    if (this.userID) {
      this.adminService.approveUser(this.userID).subscribe(
        () => {
          console.log('User approved successfully:', this.consultantDetails);
          alert('User approved successfully!'); // Show success message
          this.closeExpansion.emit(); // Notify parent to close expansion
          this.refreshVettedUsers.emit(); // Notify parent to refresh vetted users
        },
        (error) => {
          console.error('Error approving user:', error);
        }
      );
    }
  }

  decline() {
    console.log('Declined', this.consultantDetails);
  }
}
