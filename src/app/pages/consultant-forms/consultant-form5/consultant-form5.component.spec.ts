import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantForm5Component } from './consultant-form5.component';

describe('ConsultantForm5Component', () => {
  let component: ConsultantForm5Component;
  let fixture: ComponentFixture<ConsultantForm5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantForm5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantForm5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
