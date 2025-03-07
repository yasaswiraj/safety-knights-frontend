import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidsInProgressComponent } from './bids-in-progress.component';

describe('BidsInProgressComponent', () => {
  let component: BidsInProgressComponent;
  let fixture: ComponentFixture<BidsInProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BidsInProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BidsInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
