import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ConsultantDashboardComponent } from './pages/consultant-dashboard/consultant-dashboard.component';
import { ConsultantForm1Component } from './pages/consultant-forms/consultant-form1/consultant-form1.component';
import { ConsultantFormContactComponent } from './pages/consultant-forms/consultant-form-contact/consultant-form-contact.component';

export const routes =[
    { path: '', component: LoginComponent },
    { path: 'sign-up', component: SignUpComponent },
    {path: 'consultant-dashboard', component: ConsultantDashboardComponent},
    {path: 'consultant-form1', component: ConsultantForm1Component},
    {path: 'consultant-form-contact', component: ConsultantFormContactComponent}
];
