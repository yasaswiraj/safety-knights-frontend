import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantBiddedJobsComponent } from './consultant-bidded-jobs.component';

describe('ConsultantBiddedJobsComponent', () => {
  let component: ConsultantBiddedJobsComponent;
  let fixture: ComponentFixture<ConsultantBiddedJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantBiddedJobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantBiddedJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
