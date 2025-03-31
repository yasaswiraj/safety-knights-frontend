import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantActiveJobsComponent } from './consultant-active-jobs.component';

describe('ConsultantActiveJobsComponent', () => {
  let component: ConsultantActiveJobsComponent;
  let fixture: ComponentFixture<ConsultantActiveJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantActiveJobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantActiveJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
