import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantOptionsComponent } from './consultant-options.component';

describe('ConsultantOptionsComponent', () => {
  let component: ConsultantOptionsComponent;
  let fixture: ComponentFixture<ConsultantOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
