import { TestBed } from '@angular/core/testing';

import { ConsultantMatchesService } from './consultant-match.service';

describe('ConsultantMatchService', () => {
  let service: ConsultantMatchesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultantMatchesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
