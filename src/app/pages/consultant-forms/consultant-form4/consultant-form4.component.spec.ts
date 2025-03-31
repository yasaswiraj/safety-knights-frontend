import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantForm4Component } from './consultant-form4.component';

describe('ConsultantForm4Component', () => {
  let component: ConsultantForm4Component;
  let fixture: ComponentFixture<ConsultantForm4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantForm4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantForm4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
