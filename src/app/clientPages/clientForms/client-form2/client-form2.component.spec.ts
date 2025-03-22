import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientForm2Component } from './client-form2.component';

describe('ClientForm2Component', () => {
  let component: ClientForm2Component;
  let fixture: ComponentFixture<ClientForm2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientForm2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientForm2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
