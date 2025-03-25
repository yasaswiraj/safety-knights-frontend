import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackJobsComponent } from './track-jobs.component';

describe('TrackJobsComponent', () => {
  let component: TrackJobsComponent;
  let fixture: ComponentFixture<TrackJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackJobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
