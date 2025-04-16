import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-question-edit-card',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './question-edit-card.component.html',
  styleUrl: './question-edit-card.component.css',
})
export class QuestionEditCardComponent {
  @Input() question: any;
  isExpanded: boolean = false;
  isEditing: boolean = false;
  options: any[] = [];
  isLoading: boolean = false;
  editingQuestion: string = '';
  showAddOptionPopup: boolean = false;
  newOptionValue: string = '';
  showDeleteConfirmation: boolean = false;
  deleteOptionTarget: any = null;

  constructor(private adminService: AdminService) {}

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
    if (!this.options.length) this.fetchOptions();
  }

  fetchOptions(): void {
    if (this.question && this.question.question_id) {
      this.isLoading = true;
      this.adminService
        .getOptionsByQuestionId(this.question.question_id)
        .subscribe({
          next: (options: string[]) => {
            this.options = options.map((option: any) => {
              return { ...option, isEditable: false, old_option_value: option.option_value };
            });
            console.log('Fetched options:', this.options);
            this.isLoading = false;
          },
          error: error => {
            console.error('Error fetching options:', error);
            this.isLoading = false;
          },
        });
    }
  }

  editQuestion(): void {
    if (this.question && this.question.question_id) {
      this.isEditing = true;
      this.question = {...this.question, question: this.editingQuestion};
      this.adminService
        .editQuestion(this.question.question_id, this.question)
        .subscribe({
          next: response => {
            console.log('Question edited successfully:', response);
            this.question.isEditable = !this.question.isEditable;
            this.isEditing = false;
          },
          error: error => {
            console.error('Error editing question:', error);
            this.isEditing = false;
          }
        });
    }
  }

  toggleEditQuestion(): void {
    this.question.isEditable = !this.question.isEditable;
    this.editingQuestion = this.question.question;
  }

  toggleEditOption(option: any): void {
    this.options = this.options.map(opt => {
      if (opt.answer_id === option.answer_id) {
        return { ...opt, isEditable: !opt.isEditable };
      }
      return opt;
    }
    );
  }

  cancelEditOption(option: any): void {
    this.options = this.options.map(opt => {
      if (opt.answer_id === option.answer_id) {
        return { ...opt, isEditable: !opt.isEditable, option_value: opt.old_option_value };
      }
      return opt;
    }
    );
  }

  createOption(): void {
    if (this.newOptionValue.trim()) {
      const newOption = {
        option_value: this.newOptionValue,
        question_id: this.question.question_id,
        isEditable: false
      };
      this.adminService
        .createOption(newOption)
        .subscribe({
          next: response => {
            console.log('Option created successfully:', response);
            this.options.push({ ...newOption, answer_id: response.answer_id });
            this.closeAddOptionPopup();
          },
          error: error => {
            console.error('Error creating option:', error);
            this.closeAddOptionPopup();
          }
        });
    }
  }

  deleteOption(option: any): void {
    this.adminService
      .deleteOption(option.answer_id)
      .subscribe({
        next: response => {
          console.log('Option deleted successfully:', response);
          this.options = this.options.filter(opt => opt.answer_id !== option.answer_id);
        },
        error: error => {
          console.error('Error deleting option:', error);
        }
      });
  }

  updateOption(option: any): void {
    this.adminService
      .updateOption(option.answer_id, option)
      .subscribe({
        next: response => {
          console.log('Option updated successfully:', response);
          this.options = this.options.map(opt => {
            if (opt.answer_id === option.answer_id) {
              return { ...opt, isEditable: !opt.isEditable };
            }
            return opt;
          }
          );
        },
        error: error => {
          console.error('Error updating option:', error);
          this.options = this.options.map(opt => {
            if (opt.answer_id === option.answer_id) {
              return { ...opt, isEditable: !opt.isEditable };
            }
            return opt;
          }
          );
        }
      });
  }

  openAddOptionPopup(): void {
    this.showAddOptionPopup = true;
  }

  closeAddOptionPopup(): void {
    this.showAddOptionPopup = false;
    this.newOptionValue = '';
  }

  showDeleteConfirmationPopup(option: any) {
    this.deleteOptionTarget = option;
    this.showDeleteConfirmation = true;
  }

  confirmDeleteOption() {
    if (this.deleteOptionTarget) {
      this.deleteOption(this.deleteOptionTarget);
      this.deleteOptionTarget = null;
    }
    this.showDeleteConfirmation = false;
  }

  cancelDeleteOption() {
    this.deleteOptionTarget = null;
    this.showDeleteConfirmation = false;
  }
}
