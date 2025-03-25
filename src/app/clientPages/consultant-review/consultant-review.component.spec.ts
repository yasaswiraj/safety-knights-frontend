import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantReviewComponent } from './consultant-review.component';

describe('ConsultantReviewComponent', () => {
  let component: ConsultantReviewComponent;
  let fixture: ComponentFixture<ConsultantReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
