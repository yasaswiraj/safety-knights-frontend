import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientForm5Component } from './client-form5.component';

describe('ClientForm5Component', () => {
  let component: ClientForm5Component;
  let fixture: ComponentFixture<ClientForm5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientForm5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientForm5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
