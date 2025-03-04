import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantForm6Component } from './consultant-form6.component';

describe('ConsultantForm6Component', () => {
  let component: ConsultantForm6Component;
  let fixture: ComponentFixture<ConsultantForm6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantForm6Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantForm6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
