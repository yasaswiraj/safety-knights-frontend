import { Routes } from '@angular/router';
import { LoginComponent } from './clientPages/login/login.component';
import { SignUpComponent } from './clientPages/sign-up/sign-up.component';
import { LandingPageComponent } from './clientPages/landing-page/landing-page.component';
import { ClientDashboardComponent } from './clientPages/client-dashboard/client-dashboard.component';
import { ClientReceivedBidsComponent } from './clientPages/client-received-bids/client-received-bids.component';
import { ClientForm1Component } from './clientPages/clientForms/client-form1/client-form1.component';
import { ClientForm2Component } from './clientPages/clientForms/client-form2/client-form2.component';
import { ClientForm3Component } from './clientPages/clientForms/client-form3/client-form3.component';
import { ClientForm4Component } from './clientPages/clientForms/client-form4/client-form4.component';
import { ClientForm5Component } from './clientPages/clientForms/client-form5/client-form5.component';
import { AdminDashboardComponent } from './adminPages/dashboard/dashboard.component';
import { UsersListComponent } from './adminPages/users-list/users-list.component';
import { MatchesListComponent } from './adminPages/matches-list/matches-list.component';
import { BidsListComponent } from './adminPages/bids-list/bids-list.component';
import { ChatComponent } from './adminPages/chat/chat.component';
import { VettingComponent } from './adminPages/vetting/vetting.component';
import { SiteSettingsComponent } from './adminPages/site-settings/site-settings.component';
import { AdminLayoutComponent } from './adminPages/admin-layout/admin-layout.component';
import { ClientLayoutComponent } from './clientPages/client-layout/client-layout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ClientAgreementComponent } from './clientPages/client-agreement/client-agreement.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },

  // ✅ Client Routes with a Layout Component
  {
    path: 'client',
    component: ClientLayoutComponent, // Wrapper for client-related pages
    children: [
      { path: 'dashboard', component: ClientDashboardComponent },
      { path: 'received-bids', component: ClientReceivedBidsComponent },
      { path: 'form-1', component: ClientForm1Component },
      { path: 'form-2', component: ClientForm2Component },
      { path: 'form-3', component: ClientForm3Component },
      { path: 'form-4', component: ClientForm4Component },
      { path: 'form-5', component: ClientForm5Component },
      { path: 'agreement', component: ClientAgreementComponent },
    ],
  },

  // ✅ Admin Routes with a Layout Component
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
      {path: '**', redirectTo: '', pathMatch: 'full'},
    ],
  },
  {path: '**', component: PageNotFoundComponent},
];
