import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantForm1Component } from './consultant-form1.component';

describe('ConsultantForm1Component', () => {
  let component: ConsultantForm1Component;
  let fixture: ComponentFixture<ConsultantForm1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantForm1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantForm1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
