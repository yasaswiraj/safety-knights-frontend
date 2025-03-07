import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantProfileComponent } from './consultant-profile.component';

describe('ConsultantProfileComponent', () => {
  let component: ConsultantProfileComponent;
  let fixture: ComponentFixture<ConsultantProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
