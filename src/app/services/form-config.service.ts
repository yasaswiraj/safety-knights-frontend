import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class FormConfigService {
  private formStructure: any = null;

  setFormStructure(data: any) {
    this.formStructure = data;
  }

  getFormStructure(): any {
    return this.formStructure?.form || {};
  }

  getQuestionsForCategory(category: string): any {
    return this.getFormStructure()[category] || {};
  }

  getQuestionConfig(category: string, question: string): any {
    return this.getQuestionsForCategory(category)[question] || {};
  }

  getCategories(): string[] {
    return Object.keys(this.getFormStructure());
  }
}
