import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantFormsSubmissionComponent } from './consultant-forms-submission.component';

describe('ConsultantFormsSubmissionComponent', () => {
  let component: ConsultantFormsSubmissionComponent;
  let fixture: ComponentFixture<ConsultantFormsSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantFormsSubmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantFormsSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
