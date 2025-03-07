import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobInProgressComponent } from './job-in-progress.component';

describe('JobInProgressComponent', () => {
  let component: JobInProgressComponent;
  let fixture: ComponentFixture<JobInProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobInProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
