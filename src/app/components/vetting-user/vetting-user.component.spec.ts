import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VettingUserComponent } from './vetting-user.component';

describe('VettingUserComponent', () => {
  let component: VettingUserComponent;
  let fixture: ComponentFixture<VettingUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VettingUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VettingUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
