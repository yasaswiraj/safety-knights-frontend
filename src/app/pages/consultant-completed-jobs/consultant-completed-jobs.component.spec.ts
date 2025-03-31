import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantCompletedJobsComponent } from './consultant-completed-jobs.component';

describe('ConsultantCompletedJobsComponent', () => {
  let component: ConsultantCompletedJobsComponent;
  let fixture: ComponentFixture<ConsultantCompletedJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantCompletedJobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantCompletedJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
