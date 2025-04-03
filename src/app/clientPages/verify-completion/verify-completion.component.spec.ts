import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyCompletionComponent } from './verify-completion.component';

describe('VerifyCompletionComponent', () => {
  let component: VerifyCompletionComponent;
  let fixture: ComponentFixture<VerifyCompletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyCompletionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
