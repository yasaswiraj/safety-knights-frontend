import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetailDialogComponent } from './job-detail-dialog.component';

describe('JobDetailDialogComponent', () => {
  let component: JobDetailDialogComponent;
  let fixture: ComponentFixture<JobDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobDetailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
