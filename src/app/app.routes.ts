import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ClientForm1Component } from './pages/clientForms/client-form1/client-form1.component';
import { ClientForm2Component } from './pages/clientForms/client-form2/client-form2.component';
import { ClientDashboardComponent } from './pages/client-dashboard/client-dashboard.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'client-form-1', component: ClientForm1Component },
  { path: 'client-form-2', component: ClientForm2Component },
  { path: 'client-dashboard', component: ClientDashboardComponent },
  { path: '', component: LandingPageComponent },
  
];
