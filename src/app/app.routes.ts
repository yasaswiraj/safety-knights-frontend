import { Routes } from '@angular/router';
import { LoginComponent } from './clientPages/login/login.component';
import { LandingPageComponent } from './clientPages/landing-page/landing-page.component';
import { ClientReceivedBidsComponent } from './clientPages/client-received-bids/client-received-bids.component';
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
import { ConsultantDashboardComponent } from './pages/consultant-dashboard/consultant-dashboard.component';
import { ConsultantForm1Component } from './pages/consultant-forms/consultant-form1/consultant-form1.component';
import { ConsultantFormContactComponent } from './pages/consultant-forms/consultant-form-contact/consultant-form-contact.component';
import { ConsultantForm3Component } from './pages/consultant-forms/consultant-form3/consultant-form3.component';
import { ConsultantForm4Component } from './pages/consultant-forms/consultant-form4/consultant-form4.component';
import { ConsultantForm8Component } from './pages/consultant-forms/consultant-form8/consultant-form8.component';
import { ConsultantFormsSubmissionComponent } from './pages/consultant-forms/consultant-forms-submission/consultant-forms-submission.component';
import { ConsultantMatchesComponent } from './pages/consultant-matches/consultant-matches.component';
import { ConsultantActiveJobsComponent } from './pages/consultant-active-jobs/consultant-active-jobs.component';
import { ConsultantBiddedJobsComponent } from './pages/consultant-bidded-jobs/consultant-bidded-jobs.component';
import path from 'path';
import { ConsultantCompletedJobsComponent } from './pages/consultant-completed-jobs/consultant-completed-jobs.component';

import { BidsInProgressComponent } from './clientPages/bids-in-progress/bids-in-progress.component';
import { PendingBidsComponent } from './clientPages/pending-bids/pending-bids.component';
import { JobInProgressComponent } from './clientPages/job-in-progress/job-in-progress.component';
import { CompletedJobsComponent } from './clientPages/completed-jobs/completed-jobs.component';
import { OnboardingComponent } from './clientPages/clientForms/onboarding/onboarding.component';
import { TrackJobsComponent } from './clientPages/track-jobs/track-jobs.component';
import { FeedbackComponent } from './clientPages/feedback/feedback.component';
import { ConsultantLoginComponent } from './pages/consultant-login/consultant-login.component';
import { ClientFullFormComponent } from './clientPages/clientForms/client-full-form/client-full-form.component';
import { VerifyCompletionComponent } from './clientPages/verify-completion/verify-completion.component';
import { ClientProfileComponent } from './clientPages/client-profile/client-profile.component';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    canActivate: [() => {
      const router = inject(Router);
      if (localStorage.getItem('loggedIn')) {
        const userType = localStorage.getItem('userType');
        if (userType === 'client') return router.parseUrl('/client/bids-in-progress');
        if (userType === 'consultant') return router.parseUrl('/consultant/consultant-matches');
        if (userType === 'admin') return router.parseUrl('/admin');
      }
      return true; // Allow access to landing page if not logged in
    }],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [() => {
      const router = inject(Router);
      if (localStorage.getItem('loggedIn')) {
        const userType = localStorage.getItem('userType');
        if (userType === 'client') return router.parseUrl('/client/bids-in-progress');
        if (userType === 'consultant') return router.parseUrl('/consultant/consultant-matches');
        if (userType === 'admin') return router.parseUrl('/admin');
      }
      return true; // Allow access to login page if not logged in
    }],
  },
  { path: 'onboarding', component: OnboardingComponent }, // New combined form route
  { path: 'consultant-login', component: ConsultantLoginComponent }, // Consultant login route

  // Client Routes with a Layout Component
  {
    path: 'client',
    component: ClientLayoutComponent, // Wrapper for client-related pages
    canActivate: [() => {
      const router = inject(Router);
      if (!localStorage.getItem('loggedIn') || localStorage.getItem('userType') !== 'client') {
        return router.parseUrl('/login'); // Redirect to login if not authorized
      }
      return true;
    }],
    children: [
      { path: 'received-bids', component: ClientReceivedBidsComponent },
      { path: 'client-form', component: ClientFullFormComponent },
      { path: 'bids-in-progress', component: BidsInProgressComponent },
      { path: 'pending-bids', component: PendingBidsComponent },
      { path: 'job-in-progress', component: JobInProgressComponent },
      { path: 'verify-completion', component: VerifyCompletionComponent },
      { path: 'completed-jobs', component: CompletedJobsComponent },
      { path: 'track-jobs', component: TrackJobsComponent },
      { path: 'profile', component: ClientProfileComponent },
      { path: 'update-profile', component: ClientProfileComponent, data: { editMode: true } },
      { path: 'feedback', component: FeedbackComponent },
      { path: 'inbox', component: ChatComponent },
    ],
  },

  // Admin Routes with a Layout Component
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [() => {
      const router = inject(Router);
      if (!localStorage.getItem('loggedIn') || localStorage.getItem('userType') !== 'admin') {
        return router.parseUrl('/login'); // Redirect to login if not authorized
      }
      return true;
    }],
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
  {
    path: 'consultant',
    component: ConsultantDashboardComponent,
    canActivate: [() => {
      const router = inject(Router);
      if (!localStorage.getItem('loggedIn') || localStorage.getItem('userType') !== 'consultant') {
        return router.parseUrl('/login'); // Redirect to login if not authorized
      }
      return true;
    }],
    children: [
      {
        path: '',
        component: ConsultantMatchesComponent,
      },

      { path: 'consultant-matches', component: ConsultantMatchesComponent },
      { path: 'consultant-bidded', component: ConsultantBiddedJobsComponent },
      { path: 'consultant-active', component: ConsultantActiveJobsComponent },
      {path: 'consultant-completed',component: ConsultantCompletedJobsComponent },
      {path: 'update-profile-consultant',component: ClientProfileComponent  },
      { path: 'consultant-inbox', component: ChatComponent },
    ],
  },
  { path: 'consultant-form1', component: ConsultantForm1Component },
  {
    path: 'consultant-form-contact',
    component: ConsultantFormContactComponent,
  },
  { path: 'consultant-form3', component: ConsultantForm3Component },
  { path: 'consultant-form4', component: ConsultantForm4Component },
  { path: 'consultant-form8', component: ConsultantForm8Component },
  {
    path: 'consultant-forms-submission',
    component: ConsultantFormsSubmissionComponent,
  },

  { path: '**', component: PageNotFoundComponent },
];
