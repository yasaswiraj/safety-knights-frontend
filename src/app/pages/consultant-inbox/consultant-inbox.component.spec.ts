import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantInboxComponent } from './consultant-inbox.component';

describe('ConsultantInboxComponent', () => {
  let component: ConsultantInboxComponent;
  let fixture: ComponentFixture<ConsultantInboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantInboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
