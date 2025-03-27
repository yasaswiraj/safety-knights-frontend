import { TestBed } from '@angular/core/testing';

import { ClientJobsService } from './client-jobs.service';

describe('ClientJobsService', () => {
  let service: ClientJobsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientJobsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
