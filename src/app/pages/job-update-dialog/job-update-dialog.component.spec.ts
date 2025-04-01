import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobUpdateDialogComponent } from './job-update-dialog.component';

describe('JobUpdateDialogComponent', () => {
  let component: JobUpdateDialogComponent;
  let fixture: ComponentFixture<JobUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobUpdateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
