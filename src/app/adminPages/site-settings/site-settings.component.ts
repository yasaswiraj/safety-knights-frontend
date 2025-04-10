import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { QuestionEditCardComponent } from "../../components/question-edit-card/question-edit-card.component";

@Component({
  selector: 'app-site-settings',
  imports: [QuestionEditCardComponent],
  templateUrl: './site-settings.component.html',
  styleUrl: './site-settings.component.css'
})
export class SiteSettingsComponent implements OnInit {
  activeTab = 'consultant'; 
  questions: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getQuestions().subscribe(
      (questions) => {
        this.questions = questions.questions.map((question: any) => {
          return {
            ...question,
            isEditable: false,
          };
        });
        console.log('Questions:', questions.questions);
      },
      (error) => {
        console.error('Error fetching questions:', error);
      }
    );
  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }
}
