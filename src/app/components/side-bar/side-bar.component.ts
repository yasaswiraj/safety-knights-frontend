import { Component, Input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  isActive(label: string): boolean {
    return this.activeLabel() === label;
  }

  setActiveLabel(label: string) {
    this.activeLabel.set(label);
  }

  @Input() menuItems: MenuItem[] = [];
}
