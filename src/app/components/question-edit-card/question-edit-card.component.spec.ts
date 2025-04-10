import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionEditCardComponent } from './question-edit-card.component';

describe('QuestionEditCardComponent', () => {
  let component: QuestionEditCardComponent;
  let fixture: ComponentFixture<QuestionEditCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionEditCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionEditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
