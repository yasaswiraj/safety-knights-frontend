import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantMatchesComponent } from './consultant-matches.component';

describe('ConsultantMatchesComponent', () => {
  let component: ConsultantMatchesComponent;
  let fixture: ComponentFixture<ConsultantMatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantMatchesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
