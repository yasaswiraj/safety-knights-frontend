import { TestBed } from '@angular/core/testing';

import { ConsultantJobBiddedService } from './consultant-job-bidded.service';

describe('ConsultantJobBiddedService', () => {
  let service: ConsultantJobBiddedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultantJobBiddedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
