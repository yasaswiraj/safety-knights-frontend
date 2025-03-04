import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantForm7Component } from './consultant-form7.component';

describe('ConsultantForm7Component', () => {
  let component: ConsultantForm7Component;
  let fixture: ComponentFixture<ConsultantForm7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantForm7Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantForm7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
