import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantFormContactComponent } from './consultant-form-contact.component';

describe('ConsultantFormContactComponent', () => {
  let component: ConsultantFormContactComponent;
  let fixture: ComponentFixture<ConsultantFormContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantFormContactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantFormContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
