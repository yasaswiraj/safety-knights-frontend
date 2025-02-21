import { Component } from '@angular/core';
import { AdminSideBarComponent } from '../../components/admin-side-bar/admin-side-bar.component';
import { AdminNavBarComponent } from '../../components/admin-nav-bar/admin-nav-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [AdminSideBarComponent, AdminNavBarComponent, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

}
