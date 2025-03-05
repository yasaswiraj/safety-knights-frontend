import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidsListComponent } from './bids-list.component';

describe('BidsListComponent', () => {
  let component: BidsListComponent;
  let fixture: ComponentFixture<BidsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BidsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BidsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
