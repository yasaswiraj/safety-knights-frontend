import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ClientForm1Component } from './pages/clientForms/client-form1/client-form1.component';
import { ClientForm2Component } from './pages/clientForms/client-form2/client-form2.component';
import { ClientDashboardComponent } from './pages/client-dashboard/client-dashboard.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { ClientForm3Component } from './pages/clientForms/client-form3/client-form3.component';
import { ClientForm4Component } from './pages/clientForms/client-form4/client-form4.component';
import { ClientForm5Component } from './pages/clientForms/client-form5/client-form5.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'client-form-1', component: ClientForm1Component },
  { path: 'client-form-2', component: ClientForm2Component },
  { path: 'client-dashboard', component: ClientDashboardComponent },
  { path: 'client-form-3', component: ClientForm3Component },
  { path: 'client-form-4', component: ClientForm4Component },
  { path: 'client-form-5', component: ClientForm5Component },
];
