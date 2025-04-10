import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBidComponent } from './update-bid.component';

describe('UpdateBidComponent', () => {
  let component: UpdateBidComponent;
  let fixture: ComponentFixture<UpdateBidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateBidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateBidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
