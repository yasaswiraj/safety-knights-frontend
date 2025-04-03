import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-vetting-user',
  standalone: true,
  imports: [],
  templateUrl: './vetting-user.component.html',
  styleUrls: ['./vetting-user.component.css']
})
export class VettingUserComponent implements OnInit, OnChanges {
  @Input() userID: number | null = null; 

  constructor() {}

  ngOnInit() {
    console.log('User ID on init:', this.userID);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userID'] && !changes['userID'].isFirstChange()) {
      console.log('User ID changed to:', changes['userID'].currentValue);
    }
  }
}
