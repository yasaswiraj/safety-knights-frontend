import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsTreeComponent } from './options-tree.component';

describe('OptionsTreeComponent', () => {
  let component: OptionsTreeComponent;
  let fixture: ComponentFixture<OptionsTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionsTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
