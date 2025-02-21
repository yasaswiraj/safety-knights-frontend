import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VettingComponent } from './vetting.component';

describe('VettingComponent', () => {
  let component: VettingComponent;
  let fixture: ComponentFixture<VettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
