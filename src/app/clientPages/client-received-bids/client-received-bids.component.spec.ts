import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientReceivedBidsComponent } from './client-received-bids.component';

describe('ClientReceivedBidsComponent', () => {
  let component: ClientReceivedBidsComponent;
  let fixture: ComponentFixture<ClientReceivedBidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientReceivedBidsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientReceivedBidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
