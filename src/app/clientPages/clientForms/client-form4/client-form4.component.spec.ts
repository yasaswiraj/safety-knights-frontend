import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientForm4Component } from './client-form4.component';

describe('ClientForm4Component', () => {
  let component: ClientForm4Component;
  let fixture: ComponentFixture<ClientForm4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientForm4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientForm4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
