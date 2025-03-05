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
import { AdminDashboardComponent } from './adminPages/dashboard/dashboard.component';
import { UsersListComponent } from './adminPages/users-list/users-list.component';
import { MatchesListComponent } from './adminPages/matches-list/matches-list.component';
import { BidsListComponent } from './adminPages/bids-list/bids-list.component';
import { ChatComponent } from './adminPages/chat/chat.component';
import { VettingComponent } from './adminPages/vetting/vetting.component';
import { SiteSettingsComponent } from './adminPages/site-settings/site-settings.component';
import { AdminLayoutComponent } from './adminPages/admin-layout/admin-layout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
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
import { ConsultantMatchesComponent } from './pages/consultant-matches/consultant-matches.component';
import path from 'path';


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
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'users-list', component: UsersListComponent },
      { path: 'matches-list', component: MatchesListComponent },
      { path: 'bids-list', component: BidsListComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'vetting', component: VettingComponent },
      { path: 'site-settings', component: SiteSettingsComponent },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
  {path: 'consultant', component: ConsultantDashboardComponent
,
  children: [
    {
      path : '' , component : ConsultantMatchesComponent
    }
  ]    
  },

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
  {path: 'consultant-matches', component: ConsultantMatchesComponent },
  { path: '**', component: PageNotFoundComponent },

]