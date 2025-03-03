import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientForm3Component } from './client-form3.component';

describe('ClientForm3Component', () => {
  let component: ClientForm3Component;
  let fixture: ComponentFixture<ClientForm3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientForm3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientForm3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
