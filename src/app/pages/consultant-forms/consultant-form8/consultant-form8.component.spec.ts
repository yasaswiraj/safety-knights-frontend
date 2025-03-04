import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantForm8Component } from './consultant-form8.component';

describe('ConsultantForm8Component', () => {
  let component: ConsultantForm8Component;
  let fixture: ComponentFixture<ConsultantForm8Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantForm8Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantForm8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
