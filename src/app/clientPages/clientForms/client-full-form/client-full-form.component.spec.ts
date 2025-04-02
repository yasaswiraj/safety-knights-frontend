import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFullFormComponent } from './client-full-form.component';

describe('ClientFullFormComponent', () => {
  let component: ClientFullFormComponent;
  let fixture: ComponentFixture<ClientFullFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientFullFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientFullFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
