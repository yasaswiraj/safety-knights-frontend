import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfileConsultantComponent } from './update-profile-consultant.component';

describe('UpdateProfileConsultantComponent', () => {
  let component: UpdateProfileConsultantComponent;
  let fixture: ComponentFixture<UpdateProfileConsultantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProfileConsultantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProfileConsultantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
