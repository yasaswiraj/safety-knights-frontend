import { TestBed } from '@angular/core/testing';

import { ClientOnboardingService } from './client-onboarding.service';

describe('ClientOnboardingService', () => {
  let service: ClientOnboardingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientOnboardingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
