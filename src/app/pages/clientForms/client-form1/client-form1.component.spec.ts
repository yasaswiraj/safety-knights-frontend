import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientForm1Component } from './client-form1.component';

describe('ClientForm1Component', () => {
  let component: ClientForm1Component;
  let fixture: ComponentFixture<ClientForm1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientForm1Component],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientForm1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
