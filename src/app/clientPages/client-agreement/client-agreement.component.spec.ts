import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAgreementComponent } from './client-agreement.component';

describe('ClientAgreementComponent', () => {
  let component: ClientAgreementComponent;
  let fixture: ComponentFixture<ClientAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAgreementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
