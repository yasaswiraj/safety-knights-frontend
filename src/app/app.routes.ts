import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ConsultantDashboardComponent } from './pages/consultant-dashboard/consultant-dashboard.component';
import { ConsultantForm1Component } from './pages/consultant-forms/consultant-form1/consultant-form1.component';
import { ConsultantFormContactComponent } from './pages/consultant-forms/consultant-form-contact/consultant-form-contact.component';
import { ConsultantForm2Component } from './pages/consultant-forms/consultant-form2/consultant-form2.component';
import { ConsultantForm3Component } from './pages/consultant-forms/consultant-form3/consultant-form3.component';
import { ConsultantForm4Component } from './pages/consultant-forms/consultant-form4/consultant-form4.component';
import { ConsultantForm5Component } from './pages/consultant-forms/consultant-form5/consultant-form5.component';
import { ConsultantForm6Component } from './pages/consultant-forms/consultant-form6/consultant-form6.component';
import { ConsultantForm7Component } from './pages/consultant-forms/consultant-form7/consultant-form7.component';
import { ConsultantForm8Component } from './pages/consultant-forms/consultant-form8/consultant-form8.component';
import { ConsultantFormsSubmissionComponent } from './pages/consultant-forms/consultant-forms-submission/consultant-forms-submission.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { Component } from '@angular/core';

export const routes =[
    { path: '', component: LoginComponent },
    { path: 'sign-up', component: SignUpComponent },
    {path: 'consultant-dashboard', component: ConsultantDashboardComponent},
    {path: 'consultant-form1', component: ConsultantForm1Component},
    {path: 'consultant-form-contact', component: ConsultantFormContactComponent},
    {path: 'consultant-form2', component: ConsultantForm2Component},
    {path: 'consultant-form3', component: ConsultantForm3Component},
    {path: 'consultant-form4', component: ConsultantForm4Component},
    {path: 'consultant-form5', component: ConsultantForm5Component},
    {path: 'consultant-form6', component: ConsultantForm6Component},
    {path: 'consultant-form7', component: ConsultantForm7Component},
    {path: 'consultant-form8', component: ConsultantForm8Component},
    {path: 'consultant-forms-submission', component: ConsultantFormsSubmissionComponent },
    {path: 'landing-page', component: LandingPageComponent}

];
