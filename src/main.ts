import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { provideClientHydration } from '@angular/platform-browser';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  ...appConfig,  // Keep existing configuration
  providers: [
    ...appConfig.providers, // Merge existing providers
    provideHttpClient() // Enable HTTP Client
  ],
}).catch(err => console.error(err));
