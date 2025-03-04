import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantForm2Component } from './consultant-form2.component';

describe('ConsultantForm2Component', () => {
  let component: ConsultantForm2Component;
  let fixture: ComponentFixture<ConsultantForm2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantForm2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantForm2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
