import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';  


interface MenuItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-side-bar',
  imports: [RouterModule, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent {
  @Input() isSidebarOpen = true;
  activeLabel = signal<string>('Dashboard');
  constructor(private router: Router) {}
  isActive(label: string): boolean {
    return this.activeLabel() === label;
  }

  setActiveLabel(label: string) {
    this.activeLabel.set(label);
  }

  goToLandingPage() {
    this.router.navigate(['/']); 
  }

  @Input() menuItems: MenuItem[] = [];
  @Output() menuClick = new EventEmitter<MenuItem>();

  handleMenuClick(item: MenuItem) {
    this.menuClick.emit(item);
    this.setActiveLabel(item.label);
  }

}
