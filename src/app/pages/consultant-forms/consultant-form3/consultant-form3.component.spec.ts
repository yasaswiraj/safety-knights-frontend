import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantForm3Component } from './consultant-form3.component';

describe('ConsultantForm3Component', () => {
  let component: ConsultantForm3Component;
  let fixture: ComponentFixture<ConsultantForm3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantForm3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantForm3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
